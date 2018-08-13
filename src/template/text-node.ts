import { Delay, ChangeType } from './template'
import { Helper, DelayTransfomer } from './helper'
import { Renderable } from '../renderable'
import { View } from '../view'
import { Node } from './node'

class StaticTextNode extends Node {
    data: string
    node: Text

    constructor (data: string = '') {
        super()
        this.data = data
        this.node = document.createTextNode(this.data)
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true
        this.parent.append(this.node)
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)
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

    init (root: Renderable<any>) {
        if (root instanceof View && this.helper instanceof DelayTransfomer) {
            this.helper.init(root)
        }
    }

    render (context: object, delay: Delay) {
        super.render(context, delay)
        this.update(context, delay)
    }

    update (context: object, delay: Delay) {
        const r = this.helper.render(context)
        if (r[0] === ChangeType.CHANGED) {
            this.node.data = r[1]
        }
    }

    clearHelper () {
        this.helper.clear()
        super.clearHelper()
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

    init (root: Renderable<any>, delay: Delay) {
        this.nodes.forEach(it => {
            it.parent = this.parent
            it.init(root, delay)
        })
    }

    render (context: object, delay: Delay) {
        this.nodes.forEach(it => it.render(context, delay))
    }

    update (context: object, delay: Delay) {
        this.nodes.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        this.nodes.forEach(it => it.destroy(delay))
    }

    clearHelper () {
        this.nodes.forEach(it => it.clearHelper())
    }
}
