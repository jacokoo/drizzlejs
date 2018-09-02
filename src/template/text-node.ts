import { ChangeType } from './template'
import { Helper } from './helper'
import { Node } from './node'
import { DataContext, Context } from './context'

class StaticTextNode extends Node {
    data: string
    node: Text

    constructor (data: string = '') {
        super()
        this.data = data
        this.node = document.createTextNode(this.data)
    }

    render (context: DataContext) {
        if (this.rendered) return
        this.rendered = true
        this.parent.append(this.node)
    }

    destroy (context: Context) {
        if (!this.rendered) return
        super.destroy(context)
        this.parent.remove(this.node)
        this.rendered = false
    }
}

class DynamicTextNode extends StaticTextNode {
    helper: Helper

    constructor(helper: Helper) {
        super()
        this.helper = helper
    }

    render (context: DataContext) {
        super.render(context)
        this.update(context)
    }

    update (context: DataContext) {
        const r = this.helper.render(context)
        if (r[0] === ChangeType.CHANGED) {
            this.node.data = r[1] == null ? '' : r[1]
        }
    }

}

export class TextNode extends Node {
    nodes: Node[]

    constructor (...args: (string | Helper)[]) {
        super()
        this.nodes = args.map(it => {
            return (typeof it === 'string') ? new StaticTextNode(it) : new DynamicTextNode(it)
        })
    }

    init (context: Context) {
        this.nodes.forEach(it => {
            it.parent = this.parent
            it.init(context)
        })
    }

    render (context: DataContext) {
        this.nodes.forEach(it => {
            if (!it.parent) it.parent = this.parent
            it.render(context)
        })
    }

    update (context: DataContext) {
        this.nodes.forEach(it => it.update(context))
    }

    destroy (context: Context) {
        this.nodes.forEach(it => it.destroy(context))
    }

}
