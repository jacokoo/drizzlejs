import { Node } from './node'
import { Renderable } from '../renderable'
import { getValue, Delay, Appendable } from './template'
import { AnchorNode } from './anchor-node'

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

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
    }

    isEmpty (list: any): boolean {
        return !list || (Array.isArray(list) && !list.length) || (typeof list === 'object' && !Object.keys(list))
    }

    sub (context: {[key: string]: any}, i: number | string) {
        const o = Object.assign({}, context)
        if (!o._each) o._each = []
        const v = getValue(this.args[0], context)
        o._each.push({list: v, index: i, key: this.args[2]})

        o[this.args[2]] = v[i]
        if (this.args[3]) o[this.args[3]] = i
        return o
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true

        super.render(context, delay)
        if (this.falseNode) this.falseNode.parent = this.newParent

        const list = getValue(this.args[0], context)
        if (this.isEmpty(list)) {
            this.renderElse(context, delay)
            return
        }

        const kv = Array.isArray(list) ?
            list.map((it, i) => [i, it]) as [any, any] :
            Object.keys(list).map(it => [it, list[it]] as [any, any])

        this.renderKeyValue(kv, context, delay)
    }

    createTrueNode (delay: Delay) {
        const n = this.trueNode()
        n.parent = this.newParent
        n.init(this.root, delay)
        return n
    }

    renderKeyValue (arr: [any, any][], context: object, delay: Delay) {
        this.currentSize = arr.length
        arr.forEach((it, i) => {
            const sub = this.sub(context, i)
            this.nodes[i] = this.createTrueNode(delay)
            this.nodes[i].render(sub, delay)
        })
    }

    renderElse (context: object, delay: Delay) {
        if (!this.falseNode) return
        this.falseNode.init(this.root, delay)
        this.falseNode.render(context, delay)
    }

    update (context: object, delay: Delay) {
        if (!this.rendered) return

        const list = getValue(this.args[0], context)
        const empty = this.isEmpty(list)
        if (empty && !this.currentSize) {
            this.updateElse(context, delay)
            return
        }

        if (empty) {
            this.currentSize = 0
            this.nodes.forEach(it => it.destroy(delay))
            this.nodes = []

            this.renderElse(context, delay)
            return
        }

        const kv = Array.isArray(list) ?
            list.map((it, i) => [i, it] as [any, any]) :
            Object.keys(list).map(it => [it, list[it]] as [any, any])

        this.updateKeyValue(kv, context, delay)
    }

    updateElse (context: object, delay: Delay) {
        if (this.falseNode) this.falseNode.update(context, delay)
    }

    updateKeyValue (arr: [any, any][], context: object, delay: Delay) {
        this.currentSize = arr.length
        arr.forEach((it, i) => {
            const sub = this.sub(context, i)

            if (this.nodes[i]) {
                this.nodes[i].clearHelper()
                this.nodes[i].update(sub, delay)
            } else {
                this.nodes[i] = this.createTrueNode(delay)
                this.nodes[i].render(sub, delay)
            }
        })

        while (this.nodes.length !== this.currentSize) {
            const node = this.nodes.pop()
            node.destroy(delay)
        }
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)

        if (!this.currentSize) {
            if (this.falseNode) this.falseNode.destroy(delay)
            return
        }

        this.currentSize = 0
        this.nodes.forEach(it => it.destroy(delay))
        this.nodes = []
        this.rendered = false
    }

    create () {
        return null
    }
}
