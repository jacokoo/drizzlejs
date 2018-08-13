import {
    IfHelper, UnlessHelper, Helper, DelayTransfomer, ConcatHelper, EchoHelper
} from './template/helper'
import { IfBlock, UnlessBlock } from './template/if-block'
import { EachBlock } from './template/each-block'
import { Loader } from './loader'
import { ModuleTemplate } from './template/module-template'
import { ViewTemplate } from './template/view-template'
import { customEvents, Attribute, AttributeValue } from './template/template'
import { Application } from './application'
import { StaticNode } from './template/static-node'
import { DynamicNode } from './template/dynamic-node'
import { TextNode } from './template/text-node'
import { ReferenceNode } from './template/reference-node'
import { RegionNode } from './template/region-node'
import { Node } from './template/node'

export interface Disposable {
    dispose (): void
}

const helpers = {
    echo: EchoHelper, if: IfHelper, unless: UnlessHelper, concat: ConcatHelper
}

const blocks = {
    if: IfBlock, unless: UnlessBlock, each: EachBlock
}

const loaders = {
    default: Loader
}

const SN = (name: string, id: string, ...attributes: [string, string][]) => {
    return new StaticNode(name, attributes || [], id)
}
const DN = (
    name: string, id: string, attributes: [string, string][] = [],
    dynamics: [string, Helper[]][],
    binds: [string, string][],
    events: [string, string, Attribute[]][],
    actions: [string, string, Attribute[]][]
) => {
    const d = new DynamicNode(name, attributes, id)
    if (dynamics) dynamics.forEach(da => d.attribute(da[0], ...da[1]))
    if (binds) binds.forEach(b => d.bind(b[0], b[1]))
    if (events) events.forEach(e => d.on(e[0], e[1], e[2]))
    if (actions) actions.forEach(a => d.action(a[0], a[1], a[2]))
    return d
}
const TX = (...ss: (string | Helper)[]) => new TextNode(...ss)
const RG = (id: string = 'default') => new RegionNode(id)
const REF = (
    name: string, id: string,
    binds: [string, string][],
    events: [string, string, Attribute[]][],
    actions: [string, string, Attribute[]][]
) => {
    const d = new ReferenceNode(name, id)
    if (binds) binds.forEach(b => d.bind(b[0], b[1]))
    if (events) events.forEach(e => d.on(e[0], e[1], e[2]))
    if (actions) actions.forEach(a => d.action(a[0], a[1], a[2]))
    return d
}

const E = (event: string, method: string, ...attrs: Attribute[]) => [event, method, attrs]
const NDA = (v: string) => [null, [1, v]] as Attribute
const NSA = (v: string) => [null, [0, v]] as Attribute
const DA = (name: string, ...hs: Helper[]) => [name, hs]

const SV = (v: string) => [0, v] as AttributeValue
const DV = (v: string) => [1, v] as AttributeValue
const AT = (n: string, v: AttributeValue) => [n, v] as Attribute
const KV = (k: string, v?: string) => [k, v || k]

const H = (n: string | AttributeValue) => Array.isArray(n) ? new EchoHelper(n) : new EchoHelper(DV(n))
const HH = (n: string, ...args: AttributeValue[]) => {
    if (helpers[n]) return new helpers[n](...args)
    return new DelayTransfomer(n, ...args)
}
const HIF = (...args: AttributeValue[]) => HH('if', ...args)
const HUN = (...args: AttributeValue[]) => HH('unless', ...args)

const EACH = (args: string[], trueNode: () => Node, falseNode?: Node) => new EachBlock(args, trueNode, falseNode)
const IF = (n: string, trueNode: Node, falseNode?: Node) => new IfBlock([DV(n)], trueNode, falseNode)
const IFC = (args: AttributeValue[], trueNode: Node, falseNode?: Node) => new IfBlock(args, trueNode, falseNode)
const UN = (n: string, trueNode: Node, falseNode?: Node) => new UnlessBlock([DV(n)], trueNode, falseNode)
const C = (parent: Node, ...children: Node[]) => parent.setChildren(children)

export default {
    helpers, blocks, loaders, customEvents,
    lifecycles: {module: [], view: []},
    ModuleTemplate, ViewTemplate, Application, Loader,
    factory: {
        SN, DN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, HH, HIF, HUN,
        EACH, IF, IFC, UN, C, DA, A: E, B: KV
    }
}
