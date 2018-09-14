import { Node } from './node'
import { Renderable } from '../renderable'
import { Context, DataContext } from './context'
import { AnchorNode } from './anchor-node'

export class RegionNode extends AnchorNode {
    nodes: Node[]
    item: Renderable<any>
    context: DataContext

    constructor(id: string = 'default') {
        super()
        this.id = id
    }

    init (context: Context) {
        const me = this
        context.region(this.id, {
            get item () {
                return me.item
            },
            show (name: string, state: object): Promise<any> {
                return me.show(name, state)
            },
            _showNode (nodes: Node[], ctx: DataContext): Promise<any> {
                return me.showNode(nodes, ctx)
            },
            _showChildren () {
                if (!me.context) return Promise.resolve()
                return me.showNode(me.children, me.context)
            },
            close () {
                return me.close()
            }
        })
    }

    render (context: DataContext) {
        if (this.rendered) return
        this.rendered = true

        super.render(context)
        this.context = context

        this.children.forEach(it => {
            it.parent = this.newParent
            it.init(context)
        })
    }

    update (context: DataContext) {
        if (!this.rendered) return
        this.context = context

        if (this.nodes === this.children) this.nodes.forEach(it => it.update(context))
    }

    destroy (context: Context) {
        if (!this.rendered) return
        super.destroy(context)
        if (this.nodes) this.nodes.forEach(it => it.destroy(context))
        if (this.item) context.delay(this.item.destroy())
        this.rendered = false
    }

    showNode (nodes: Node[], context: DataContext): Promise<any> {
        if (!this.rendered) return
        this.context = context
        return context.end().then(() => this.close().then(() => {
            this.nodes = nodes
            this.nodes.forEach(it => {
                it.parent = this.newParent
                it.render(context)
            })
            return context.end()
        }))
    }

    show (name: string, state: object) {
        if (!this.rendered) return
        return this.context.end().then(() => this.close().then(() => this.context.create(name, state)).then(item => {
            this.item = item
            return item._render(this.newParent).then(() => {
                return item
            })
        }))
    }

    close (): Promise<any> {
        if (!this.nodes && !this.item) return Promise.resolve()
        return Promise.resolve().then(() => {
            if (this.nodes) {
                this.nodes.forEach(it => it.destroy(this.context))
                return this.context.end()
            }
        }).then(() => {
            if (this.item) return this.item.destroy()
        }).then(() => {
            this.nodes = null
            this.item = null
        })
    }
}
