import {ItemOptions, Module} from '../module'
import { Node, FakeNode } from './node'
import { Lifecycle } from '../lifecycle'
import { Renderable } from '../renderable'
import { Delay } from './template'

export class ModuleTemplate {
    root: Renderable<any>
    options: {
        exportedModels: string[]
        items: ItemOptions
    }
    lifecycle: Lifecycle = {stage: 'template'}
    nodes: Node[]

    constructor(exportedModels: string[]) {
        this.options = {exportedModels, items: {}}
        const me = this
        this.lifecycle.init = function(this: Module) { return Delay.also(d => me.init(this, d)) }
        this.lifecycle.beforeRender = function(this: Module) { return Delay.also(d => me.render(this.get(), d)) }
        this.lifecycle.beforeUpdate = function(this: Module) { return Delay.also(d => me.update(this.get(), d)) }
        this.lifecycle.beforeDestroy = function(this: Module) { return Delay.also(d => me.destroy(d)) }
    }

    views (...views: string[]) {
        views.forEach(it => this.options.items[it] = {view: it})
    }

    modules (name: string, path: string, loader?: string, args?: string[]) {
        this.options.items[name] = loader ? {path, loader: {name: loader, args}} : {path}
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.nodes.forEach(it => it.init(root, delay))
    }

    render (context: object, delay: Delay) {
        const container = new FakeNode(this.root._element)
        const next = this.root._nextSibling && new FakeNode(this.root._nextSibling)
        this.nodes.forEach(it => {
            it.parent = container
            it.nextSibling = next
            it.render(context, delay)
        })
    }

    update (context: object, delay: Delay) {
        this.nodes.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        this.nodes.forEach(it => {
            it.destroy(delay)
            it.nextSibling = null
            it.parent = null
        })
    }
}
