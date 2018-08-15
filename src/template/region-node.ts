import { Node } from './node'
import { Delay } from './template'
import { Renderable } from '../renderable'
import { Module } from '../module'
import { View } from '../view'

export class RegionNode extends Node {
    nodes: Node[]
    item: Renderable<any>
    context: object
    mod: Module

    constructor(id: string = 'default') {
        super()
        this.id = id
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.mod = (root instanceof Module) ? root : (root as View)._module
        this.children.forEach(it => {
            it.parent = this.parent
            it.init(root, delay)
        })

        const me = this
        this.mod.regions[this.id] = {
            show (name: string, state: object): Promise<any> {
                return me.show(name, state)
            },
            _showNode (nodes: Node[], context: object): Promise<any> {
                return me.showNode(nodes, context)
            },
            close () {
                return me.close()
            }
        }
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return

        this.rendered = true
        this.context = context
        this.children.forEach(it => it.render(context, delay))
    }

    update (context: object, delay: Delay) {
        if (!this.rendered) return
        this.context = context
        this.children.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        if (this.nodes) this.nodes.forEach(it => it.destroy(delay))
        if (this.item) delay.add(this.item.destroy())
        this.children.forEach(it => it.destroy(delay))
        this.rendered = false
    }

    showNode (nodes: Node[], context: object): Promise<any> {
        if (!this.rendered) return
        return this.close().then(() => {
            this.nodes = nodes
            return Delay.also(d => this.nodes.forEach(it => {
                it.parent = this.parent
                it.render(context, d)
            }))
        })
    }

    show (name: string, state: object) {
        if (!this.rendered) return
        return this.close().then(() => this.mod.createItem(name, state)).then(item => {
            this.item = item
            return item._render(this.parent).then(() => item)
        })
    }

    close (): Promise<any> {
        if (!this.nodes && !this.item) return Promise.resolve()
        return Promise.resolve().then(() => {
            if (this.nodes) return Delay.also(d => this.nodes.forEach(it => it.destroy(d)))
        }).then(() => {
            if (this.item) return this.item.destroy()
        }).then(() => {
            this.nodes = null
            this.item = null
            return Delay.also(d => this.children.forEach(it => it.render(this.context, d)))
        })
    }
}
