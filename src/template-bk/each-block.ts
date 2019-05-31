import { Node } from './node'
import { getValue } from './util'
import { AnchorNode } from './anchor-node'
import { DataContext, Context } from './context'

export class EachBlock extends AnchorNode {
    args: string[]
    trueNode: () => Node
    falseNode?: Node
    currentSize = 0
    nodes: Node[] = []

    constructor (args: string[], trueNode: () => Node, falseNode?: Node) {
        super()
        this.args = args
        this.trueNode = trueNode
        this.falseNode = falseNode
    }

    init () {}

    isEmpty (list: any): boolean {
        return !list || (Array.isArray(list) && !list.length) || (typeof list === 'object' && !Object.keys(list))
    }

    sub (context: DataContext, i: number | string) {
        const o = Object.assign({}, context.data)
        if (!o._each) o._each = []
        else o._each = o._each.slice(0)

        const v = getValue(this.args[0], context)
        o._each.push({list: v, index: i, key: this.args[2], name: this.args[0]})

        o[this.args[2]] = v[i]
        if (this.args[3]) o[this.args[3]] = i
        return context.sub(o)
    }

    render (context: DataContext) {
        if (this.rendered) return
        this.rendered = true

        super.render(context)
        if (this.falseNode) this.falseNode.parent = this.newParent

        const list = getValue(this.args[0], context)
        if (this.isEmpty(list)) {
            this.renderElse(context)
            return
        }

        const kv = Array.isArray(list) ?
            list.map((it, i) => [i, it]) as [number | string, any] :
            Object.keys(list).map(it => [it, list[it]] as [number | string, any])

        this.renderKeyValue(kv, context)
    }

    createTrueNode (i: number, context: DataContext) {
        const n = this.trueNode()
        n.parent = this.newParent
        this.nodes[i] = n
        n.init(context)
        context.end().then(() => n.render(context))
    }

    renderKeyValue (arr: [number | string, any][], context: DataContext) {
        this.currentSize = arr.length
        arr.forEach((it, i) => {
            const sub = this.sub(context, it[0])
            this.createTrueNode(i, sub)
        })
    }

    renderElse (context: DataContext) {
        if (!this.falseNode) return
        this.falseNode.init(context)
        this.falseNode.render(context)
    }

    update (context: DataContext) {
        if (!this.rendered) return

        const list = getValue(this.args[0], context)
        const empty = this.isEmpty(list)
        if (empty && !this.currentSize) {
            this.updateElse(context)
            return
        }

        if (empty) {
            this.currentSize = 0
            this.nodes.forEach(it => it.destroy(context))
            this.nodes = []

            this.renderElse(context)
            return
        }

        if (!this.currentSize && this.falseNode) {
            this.falseNode.destroy(context)
        }

        const kv = Array.isArray(list) ?
            list.map((it, i) => [i, it] as [any, any]) :
            Object.keys(list).map(it => [it, list[it]] as [any, any])

        this.updateKeyValue(kv, context)
    }

    updateElse (context: DataContext) {
        if (this.falseNode) this.falseNode.update(context)
    }

    updateKeyValue (arr: [any, any][], context: DataContext) {
        this.currentSize = arr.length
        arr.forEach((it, i) => {
            const sub = this.sub(context, it[0])

            if (this.nodes[i]) {
                this.nodes[i].update(sub)
            } else {
                this.createTrueNode(i, sub)
            }
        })

        while (this.nodes.length !== this.currentSize) {
            const node = this.nodes.pop()
            node.destroy(context)
        }
    }

    destroy (context: Context) {
        if (!this.rendered) return
        super.destroy(context)

        if (!this.currentSize) {
            if (this.falseNode) this.falseNode.destroy(context)
            return
        }

        this.currentSize = 0
        this.nodes.forEach(it => it.destroy(context))
        this.nodes = []
        this.rendered = false
    }
}
