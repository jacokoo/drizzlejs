import {
    IfHelper, EqHelper, UnlessHelper, GtHelper, LtHelper,
    GteHelper, LteHelper, Helper, DelayTransfomer, ConcatHelper, EchoHelper, NeHelper
} from './template/helper'
import { IfBlock, UnlessBlock, GtBlock, LtBlock, GteBlock, LteBlock, EqBlock, NeBlock } from './template/if-block'
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
    echo: EchoHelper, if: IfHelper, unless: UnlessHelper, eq: EqHelper, gt: GtHelper,
    lt: LtHelper, gte: GteHelper, lte: LteHelper, concat: ConcatHelper, ne: NeHelper
}

const blocks = {
    if: IfBlock, unless: UnlessBlock, each: EachBlock, gt: GtBlock,
    lt: LtBlock, gte: GteBlock, lte: LteBlock, eq: EqBlock, ne: NeBlock
}

const loaders = {
    default: Loader
}

const SN = (name: string, id: string, ...attributes: [string, string][]) => {
    return new StaticNode(name, attributes, id)
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
const TN = (...text: Helper[]) => new TextNode(text)
const TX = (...ss: string[]) => new TextNode([new ConcatHelper(...ss.map(it => SV(it)))])
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

const H = (n: string) => new EchoHelper(DV(n))
const TR = (n: string, ...args: AttributeValue[]) => new DelayTransfomer(n, ...args)
const HIF = (n: string, t: AttributeValue, f: AttributeValue) => f ? new IfHelper(DV(n), t, f) : new IfHelper(DV(n), t)
const HEQ = (...args: AttributeValue[]) => new EqHelper(...args)
const HGT = (...args: AttributeValue[]) => new GtHelper(...args)
const HLT = (...args: AttributeValue[]) => new LtHelper(...args)
const HGTE = (...args: AttributeValue[]) => new GteHelper(...args)
const HLTE = (...args: AttributeValue[]) => new LteHelper(...args)
const HNE = (...args: AttributeValue[]) => new NeHelper(...args)

const EACH = (args: string[], trueNode: () => Node, falseNode?: Node) => new EachBlock(args, trueNode, falseNode)
const IF = (n: string, trueNode: Node, falseNode?: Node) => new IfBlock([DV(n)], trueNode, falseNode)
const EQ = (
    l: AttributeValue, r: AttributeValue, trueNode: Node, falseNode?: Node
) => new EqBlock([l, r], trueNode, falseNode)

const GT = (
    l: AttributeValue, r: AttributeValue, trueNode: Node, falseNode?: Node
) => new GtBlock([l, r], trueNode, falseNode)

const LT = (
    l: AttributeValue, r: AttributeValue, trueNode: Node, falseNode?: Node
) => new LtBlock([l, r], trueNode, falseNode)

const GTE = (
    l: AttributeValue, r: AttributeValue, trueNode: Node, falseNode?: Node
) => new GteBlock([l, r], trueNode, falseNode)

const LTE = (
    l: AttributeValue, r: AttributeValue, trueNode: Node, falseNode?: Node
) => new LteBlock([l, r], trueNode, falseNode)

const NE = (
    l: AttributeValue, r: AttributeValue, trueNode: Node, falseNode?: Node
) => new NeBlock([l, r], trueNode, falseNode)

const C = (parent: Node, ...children: Node[]) => parent.setChildren(children)

export default {
    helpers, blocks, loaders, customEvents,
    lifecycles: {module: [], view: []},
    ModuleTemplate, ViewTemplate, Application,
    factory: {
        SN, DN, TN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, TR, HIF, HEQ, HGT, HLT, HGTE, HLTE, HNE,
        EACH, IF, EQ, GT, LT, GTE, LTE, NE, C, DA, A: E, B: KV
    }
}
