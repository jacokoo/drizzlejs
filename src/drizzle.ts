import {
    IfHelper, UnlessHelper, Helper, DelayHelper, EchoHelper
} from './template/helper'
import { IfBlock, UnlessBlock } from './template/if-block'
import { EachBlock } from './template/each-block'
import { Loader } from './loader'
import {
    Attribute, AttributeValue, ModuleTemplate,
    ViewTemplate, NormalValue, ValueType,
} from './template/template'
import { components, helpers } from './template/context'
import { Application } from './application'
import { StaticNode } from './template/static-node'
import { DynamicNode } from './template/dynamic-node'
import { TextNode } from './template/text-node'
import { ReferenceNode } from './template/reference-node'
import { RegionNode } from './template/region-node'
import { Node } from './template/node'
import { TransformerItem, Transformer } from './template/transformer'
import { customEvents } from './template/context'

export interface Disposable {
    dispose (): void
}

const innerHelpers = {
    echo: EchoHelper, if: IfHelper, unless: UnlessHelper
}

const loaders = {
    default: Loader
}

// nodes
const SN = (name: string, id?: string) => new StaticNode(name, id)
const DN = (name: string, id?: string) => new DynamicNode(name, id)
const REF = (name: string, id?: string) => new ReferenceNode(name, id)
const TX = (...ss: (string | Helper)[]) => new TextNode(...ss)
const RG = (id: string = 'default') => new RegionNode(id)

// node attribute
const SA = (d: StaticNode | DynamicNode | ReferenceNode, name: string, value: any) => {
    d.attribute(name, value)
}
const DA = (d: DynamicNode, name: string, ...hs: Helper[]) => d.dynamicAttribute(name, hs)
const BD = (d: DynamicNode, from: string, to: string) => d.bind(from, to)
const MP = (d: ReferenceNode, from: string, to?: string) => d.map(from, to)
const EV = (d: DynamicNode | ReferenceNode, event: string, method: string, ...attrs: Attribute[]) => {
    d.on(event, method, attrs)
}
const AC = (d: DynamicNode | ReferenceNode, event: string, method: string, ...attrs: Attribute[]) => {
    d.action(event, method, attrs)
}
const CO = (d: DynamicNode, name: string, ...hs: Helper[]) => d.component(name, hs)
const C = (parent: Node, ...children: Node[]) => parent.setChildren(children)

// attributes
const TI = (name: string, ...args: NormalValue[]) => new TransformerItem(name, args)

const TV = (value: string, end?: NormalValue, ...items: TransformerItem[]) =>
    [ValueType.TRANSFORMER, new Transformer(value, items, end)] as AttributeValue
const SV = (v: string) => [ValueType.STATIC, v] as NormalValue
const DV = (v: string) => [ValueType.DYNAMIC, v] as NormalValue
const AT = (n: string, v: AttributeValue) => [n, v] as Attribute

// helpers
const H = (n: string | AttributeValue) => Array.isArray(n) ? new EchoHelper(n) : new EchoHelper(DV(n))
const HH = (n: string, ...args: AttributeValue[]) => {
    if (innerHelpers[n]) return new innerHelpers[n](...args)
    return new DelayHelper(n, ...args)
}

// block
const EACH = (args: string[], trueNode: () => Node, falseNode?: Node) => new EachBlock(args, trueNode, falseNode)
const IF = (args: AttributeValue[], trueNode: Node, falseNode?: Node) => new IfBlock(args, trueNode, falseNode)
const UN = (n: string, trueNode: Node, falseNode?: Node) => new UnlessBlock([DV(n)], trueNode, falseNode)

export const lifecycles = {module: [], view: []}
export const factory = {
    SN, DN, TX, RG, REF, SV, DV, AT, H, HH,
    EACH, IF, UN, C, SA, DA, BD, EV, AC, CO, TI, TV, MP
}

export {
    helpers, loaders, customEvents, components,
    ModuleTemplate, ViewTemplate, Application, Loader,
}
