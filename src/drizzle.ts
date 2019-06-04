
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
import { EventDef } from './template/context'

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

function createTag(id: string, name: string, ref?: string): DynamicTag | undefined {
    if (nodes[name]) return new nodes[name](id, ref)
}

// nodes
const SN = (id: string, name: string, ref?: string) => {
    const node = createTag(name, id, ref)
    return node ? node : new StaticTag(name, id, ref)
}
const DN = (id: string, name: string, events: string[], ref?: string) => {
    const node = createTag(name, id)
    return node ? node : new DynamicTag(name, id, events, ref)
}
const REF = (id: string, needAnchor: boolean, name: string, events: string[]) => {
    return new ReferenceTag(id, needAnchor, name, events)
}
const TX = (id: string, ...ss: [number, string][]) => new TextTag(id, ss)
const TS = (...ts: Tag[]) => new Tags(ts)

// node attribute
const SA = (d: StaticTag | DynamicTag | ReferenceTag, name: string, value: any, useSet: boolean = true) => {
    d.attr(name, value, useSet)
}
const DA = (d: DynamicTag, name: string, helper: string, useSet: boolean = true) => d.dattr(name, helper, useSet)
const EVD = (tp: Template, id: string, name: string, method: string, isAction: boolean, ...attrs: AttributeValue[]) => {
    tp.event(id, {name, method, isAction, attrs} as EventDef)
}
// const EV = (d: DynamicTag | ReferenceTag, ...events: string[]) => d.event(events)
const MP = (d: ReferenceTag, name: string, helper: string) => d.map(name, helper)

// const CO = (d: DynamicNode, name: string, ...hs: Helper[]) => d.component(name, hs)
const C = (parent: Tag, ...children: Tag[]) => {
    parent.children = new Tags(children)
    children.forEach(it => it.parent = parent)
}

// attributes
const TI = (name: string, ...args: NormalValue[]) => new TransformerItem(name, args)

const TV = (value: string, end?: NormalValue, ...items: TransformerItem[]) =>
    [ValueType.TRANSFORMER, new Transformer(value, items, end)] as AttributeValue
const SV = (v: string) => [ValueType.STATIC, v] as NormalValue
const DV = (v: string) => [ValueType.DYNAMIC, v] as NormalValue
const AT = (n: string, v: AttributeValue) => [n, v] as Attribute

// helpers
const H = (tp: Template, id: string, n: string | AttributeValue) => {
    tp.helper(id, Array.isArray(n) ? new EchoHelper([n]) : new EchoHelper([DV(n)]))
}
const HB = (tp: Template, id: string, ...args: AttributeValue[]) => {
    tp.helper(id, new BoolHelper(args))
}
const HC = (tp: Template, id: string, ...args: AttributeValue[]) => {
    tp.helper(id, new ConcatHelper(args))
}
const HIF = (tp: Template, id: string, bool: string, ...args: AttributeValue[]) => {
    tp.helper(id, new IfHelper(bool, args))
}
const HUN = (tp: Template, id: string, bool: string, ...args: AttributeValue[]) => {
    tp.helper(id, new UnlessHelper(bool, args))
}
const HM = (tp: Template, id: string, joiner: string, ...helpers: string[]) => {
    tp.helper(id, new MultiHelper(joiner, helpers))
}
const HH = (tp: Template, id: string, n: string, ...args: AttributeValue[]) => {
    tp.helper(id, new DelayHelper(n, args))
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

export const factory = {
    SN, DN, TX, REF, SV, DV, AT, H, HC, HB, HIF, HUN, HM, HH, EVD,
    EAD, EH, IF, UN, C, SA, DA, TI, TV, MP, TS
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
