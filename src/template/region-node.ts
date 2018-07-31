import { Node } from './node'
import { Delay } from './template'
import { Renderable } from '../renderable'

export class RegionNode extends Node {
    nodes: Node[]
    item: Renderable<any>
    context: object

    constructor(id: string = 'default') {
        super()
        this.id = id
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.children.forEach(it => {
            it.parent = this.parent
            it.nextSibling = this.nextSibling
            it.init(root, delay)
        })

        const me = this
        root.regions[this.id] = {
            show (item: Renderable<any>): Promise<any> {
                return me.show(item)
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
        this.nodes = nodes
        return this.close().then(() => {
            return Delay.also(d => this.nodes.forEach(it => it.render(context, d)))
        })
    }

    show (item: Renderable<any>) {
        if (!this.rendered) return
        this.item = item
        return this.close().then(() => {
            return item._render(this.parent.element, this.nextSibling && this.nextSibling.element) // TODO
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

    create () {
        return null
    }
}
