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
import { Application } from './application'
import { StaticNode } from './template/static-node'
import { DynamicNode } from './template/dynamic-node'
import { TextNode } from './template/text-node'
import { ReferenceNode } from './template/reference-node'
import { RegionNode } from './template/region-node'
import { Node } from './template/node'
import { TransformerItem, Transformer } from './template/transformer'
import { Lifecycle } from './lifecycle'
import { Module } from './module'
import { RouterPlugin } from './route'
import { WindowNode, ApplicationNode } from './template/special-nodes'

export interface Disposable {
    dispose (): void
}

const innerHelpers = {
    if: IfHelper, unless: UnlessHelper
}

interface NodeConstructor {
    new (id?: string): DynamicNode
}

const nodes: {[name: string]: NodeConstructor} = {
    window: WindowNode,
    app: ApplicationNode
}

function createNode(name: string, id?: string): DynamicNode | undefined {
    if (nodes[name]) return new nodes[name](id)
}

interface RegionConstructor {
    new (id: string): RegionNode
}

const regions: {[name: string]: RegionConstructor} = {
}

function createRegion(name: string, id: string): RegionNode | undefined {
    if (regions[name]) return new regions[name](id)
}

// nodes
const SN = (name: string, id?: string) => {
    const node = createNode(name, id)
    return node ? node : new StaticNode(name, id)
}
const DN = (name: string, id?: string) => {
    const node = createNode(name, id)
    return node ? node : new DynamicNode(name, id)
}
const REF = (name: string, id?: string) => new ReferenceNode(name, id)
const TX = (...ss: (string | Helper)[]) => new TextNode(...ss)
const RG = (name: string, id: string = 'default') => {
    const region = createRegion(name, id)
    return region ? region : new RegionNode(id)
}

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

export const factory = {
    SN, DN, TX, RG, REF, SV, DV, AT, H, HH,
    EACH, IF, UN, C, SA, DA, BD, EV, AC, CO, TI, TV, MP
}

export {
    ModuleTemplate, ViewTemplate, Application, Loader, RouterPlugin
}

export function registerNode(name: string, type: NodeConstructor) {
    nodes[name] = type
}

export function registerRegion(name: string, type: RegionConstructor) {
    regions[name] = type
}

export interface DrizzlePlugin {
    moduleLifecycles: Lifecycle[]
    viewLifecycles: Lifecycle[]
    init (app: Application): void
    started (item: Module): void
}
