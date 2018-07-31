import { IfHelper, EqHelper, UnlessHelper, GtHelper, LtHelper, GteHelper, LteHelper } from './template/helper'
import { IfBlock, UnlessBlock, GtBlock, LtBlock, GteBlock, LteBlock, EqBlock } from './template/if-block'
import { EachBlock } from './template/each-block'
import { DynamicNode } from './template/dynamic-node'
import { StaticNode } from './template/static-node'
import { ReferenceNode } from './template/reference-node'
import { RegionNode } from './template/region-node'
import { Loader } from './loader'
import { ModuleTemplate } from './template/module'

export interface Disposable {
    dispose (): void
}

export const EmptyDisposable: Disposable = {
    dispose () {}
}

const customEvents = {
    enter (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = e => {
            if (e.keyCode !== 13) return
            e.preventDefault()
            cb(e)
        }

        node.addEventListener('keypress', ee, false)

        return {
            dispose () {
                node.removeEventListener('keypress', ee, false)
            }
        }
    }
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
    customEvents, helpers, blocks, loaders,
    ModuleTemplate, DynamicNode, StaticNode, ReferenceNode, RegionNode,
    lifecycles: {module: [], view: []}
}
