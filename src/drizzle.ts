import { IfHelper, EqHelper, UnlessHelper, GtHelper, LtHelper, GteHelper, LteHelper } from './template/helper'
import { IfBlock, UnlessBlock, GtBlock, LtBlock, GteBlock, LteBlock, EqBlock } from './template/if-block'
import { EachBlock } from './template/each-block'
import { DynamicNode } from './template/dynamic-node'
import { StaticNode } from './template/static-node'
import { ReferenceNode } from './template/reference-node'
import { RegionNode } from './template/region-node'
import { Loader } from './loader'
import { ModuleTemplate } from './template/module-template'
import { ViewTemplate } from './template/view-template'
import { customEvents } from './template/template'
import { Application } from './application'

export interface Disposable {
    dispose (): void
}

const helpers = {
    if: IfHelper, unless: UnlessHelper, eq: EqHelper, gt: GtHelper,
    lt: LtHelper, gte: GteHelper, lte: LteHelper
}

const blocks = {
    if: IfBlock, unless: UnlessBlock, each: EachBlock, gt: GtBlock,
    lt: LtBlock, gte: GteBlock, lte: LteBlock, eq: EqBlock
}

const loaders = {
    default: Loader
}

export default {
    helpers, blocks, loaders, customEvents,
    lifecycles: {module: [], view: []},
    ModuleTemplate, ViewTemplate,
    DynamicNode, StaticNode, ReferenceNode, RegionNode,
    Application
}
