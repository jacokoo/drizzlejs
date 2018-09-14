import { ChangeType } from './template'
import { Helper, ConcatHelper } from './helper'
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

    init () {}

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

class HtmlDynamicTextNode extends Node {
    helper: Helper
    begin: HTMLElement
    end: HTMLElement

    constructor(helper: Helper) {
        super()
        this.helper = new ConcatHelper(...helper.args)
    }

    init () {
        this.begin = document.createElement('noscript')
        this.end = document.createElement('noscript')
    }

    render (context: DataContext) {
        if (this.rendered) return
        this.rendered = true
        this.parent.append(this.begin)
        this.parent.append(this.end)
        this.update(context)
    }

    update (context: DataContext) {
        const r = this.helper.render(context)
        if (r[0] === ChangeType.CHANGED) {
            this.remove()
            this.begin.insertAdjacentHTML('afterend', r[1])
        }
    }

    remove () {
        while (this.begin.nextSibling && this.begin.nextSibling !== this.end) {
            this.begin.parentNode.removeChild(this.begin.nextSibling)
        }
    }

    destroy (context: Context) {
        if (!this.rendered) return
        this.rendered = false

        this.remove()
        this.parent.remove(this.end)
        this.parent.remove(this.begin)
    }
}

export class TextNode extends Node {
    nodes: Node[]

    constructor (...args: (string | Helper)[]) {
        super()
        this.nodes = args.map(it => {
            if (typeof it === 'string') return new StaticTextNode(it)
            if (it.name === 'html') return new HtmlDynamicTextNode(it)
            return new DynamicTextNode(it)
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
