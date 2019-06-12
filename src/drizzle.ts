
import { Loader } from './loader'
import {
    ComponentTemplate, ViewTemplate, Template
} from './template/template'
import { Application } from './application'
import { Lifecycle } from './lifecycle'
import { Component } from './component'
import { RouterPlugin } from './route'
import {
    IfHelper, UnlessHelper, DelayHelper, EchoHelper, BoolHelper, MultiHelper, ConcatHelper
} from './template/helper'
import { DynamicTag } from './template/dynamic-tag'
import { StaticTag } from './template/static-tag'
import { ReferenceTag } from './template/reference-tag'
import { TextTag } from './template/text-tag'
import { Tag, Tags } from './template/tag'
import { TransformerItem, Transformer } from './template/transformer'
import { EachTag } from './template/each-tag'
import { Attribute, AttributeValue, NormalValue, ValueType, EachDef } from './template/common'
import { IfTag, UnlessTag } from './template/if-tag'
import { EventDef, Helper } from './template/context'
import {
    InputValue, InputChecked, Select, Binding, WindowScrollX, WindowScrollY, CheckGroup, RadioGroup
} from './template/binding'

export interface Disposable {
    dispose (): void
}

interface NodeConstructor {
    new (id: string, ref?: string): DynamicTag
}

const nodes: {[name: string]: NodeConstructor} = {
    // TODO window: WindowNode,
    // app: ApplicationNode
}

function createTag(id: string, name: string): DynamicTag | undefined {
    if (nodes[name]) return new nodes[name](id)
}

type HelperArg = string | AttributeValue

const map = (args: HelperArg[]) => args.map(it => Array.isArray(it) ? it : DV(it))

// tags
const ST = (id: string, name: string) => {
    const node = createTag(name, id)
    return node ? node : new StaticTag(name, id)
}
const DT = (id: string, name: string, events: string[], widgits: string[], bds: string[]) => {
    const node = createTag(name, id)
    return node ? node : new DynamicTag(name, id, events, widgits, bds)
}
const REF = (id: string, needAnchor: boolean, name: string, events: string[], ...mps: [string, string][]) => {
    return new ReferenceTag(id, needAnchor, name, events, mps)
}
const TX = (id: string, ...ss: [number, string][]) => new TextTag(id, ss)
const TS = (...ts: Tag[]) => new Tags(ts)
const C = (parent: Tag, ...children: Tag[]) => {
    parent.children = new Tags(children)
    children.forEach(it => it.parent = parent)
}

// node attribute
const SA = (d: StaticTag | DynamicTag | ReferenceTag, name: string, value: any, useSet: boolean = true) => {
    d.attr(name, value, useSet)
}
const DA = (d: DynamicTag, name: string, helper: string, useSet: boolean = true) => d.dattr(name, helper, useSet)

// attributes
const SV = (v: string) => [ValueType.STATIC, v] as NormalValue
const DV = (v: string) => [ValueType.DYNAMIC, v] as NormalValue
const AT = (n: string, v: AttributeValue) => [n, v] as Attribute
const TI = (name: string, ...args: NormalValue[]) => new TransformerItem(name, args)
const TV = (value: string, end?: NormalValue, ...items: TransformerItem[]) =>
    [ValueType.TRANSFORMER, new Transformer(value, items, end)] as AttributeValue

// helpers
const HE = (n: HelperArg) => Array.isArray(n) ? new EchoHelper([n]) : new EchoHelper([DV(n)])
const HB = (...args: HelperArg[]) => new BoolHelper(map(args))
const HC = (...args: HelperArg[]) => new ConcatHelper(map(args))
const HIF = (bool: string, ...args: HelperArg[]) => new IfHelper(bool, map(args))
const HUN = (bool: string, ...args: HelperArg[]) => new UnlessHelper(bool, map(args))
const HM = (joiner: string, ...helpers: string[]) => new MultiHelper(joiner, helpers)
const HH = (name: string, ...args: HelperArg[]) => new DelayHelper(name, map(args))

// event
const EV = (name: string, method: string, isAction: boolean, ...attrs: HelperArg[]) => {
    return {name, method, isAction, attrs: map(attrs)} as EventDef
}

// block
const EAD = (name: string, alias: string, idx?: string, key?: string) => {
    return {name, alias, idx, key} as EachDef
}
const EH = (id: string, needAnchor: boolean, def: EachDef, loop: Tags, falseTags?: Tags) => {
    return new EachTag(id, needAnchor, def, loop, falseTags)
}
const IF = (id: string, needAnchor: boolean, helper: string, trueTags: Tags, falseTags?: Tags) => {
    return new IfTag(id, needAnchor, helper, trueTags, falseTags)
}
const UN = (id: string, needAnchor: boolean, helper: string, trueTags: Tags, falseTags?: Tags) => {
    return new UnlessTag(id, needAnchor, helper, trueTags, falseTags)
}

interface BindingCreator {
    new (id: string, target: string): Binding
}

const bindings: BindingCreator[] = [
    InputValue, InputChecked, Select, WindowScrollX, WindowScrollY, RadioGroup, CheckGroup
]

const H = (tp: Template, id: string, h: Helper) => tp.helper(id, h)
const E = (tp: Template, id: string, e: EventDef) => tp.event(id, e)
const W = (tp: ViewTemplate, id: string, name: string, ...args: string[]) => tp.widget(id, {name, args})
const R = (tp: Template, name: string, id: string, ...each: string[]) => tp.ref(name, {id, each})
const B = (tp: ViewTemplate, id: string, type: number, target: string) => tp.binding(id, new bindings[type](id, target))

export const factory = {
    ST, DT, TX, REF, SV, DV, AT,
    H, HE, HC, HB, HIF, HUN, HM, HH,
    E, EV, EAD, EH, IF, UN, C,
    SA, DA, TI, TV, TS, W, R, B
}

export {
    ComponentTemplate, ViewTemplate, Application, Loader, RouterPlugin
}

export function registerNode(name: string, type: NodeConstructor) {
    nodes[name] = type
}

// export function registerRegion(name: string, type: RegionConstructor) {
//     regions[name] = type
// }

export interface DrizzlePlugin {
    componentLifecycles: Lifecycle[]
    viewLifecycles: Lifecycle[]
    init (app: Application): void
    started (item: Component): void
}
