import { Node } from './node'
import { Delay, ChangeType } from './template'
import { Helper, DelayTransfomer } from './helper'
import { Renderable } from '../renderable'
import { View } from '../view'

export class TextNode extends Node {
    helpers: Helper[]
    node: Text

    constructor(text: Helper[] = []) {
        super()
        this.helpers = text
    }

    init (root: Renderable<any>) {
        this.node = document.createTextNode('')
        if (root instanceof View) {
            this.helpers.forEach(it => {
                if (it instanceof DelayTransfomer) {
                    it.init(root)
                }
            })
        }
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true
        if (this.nextSibling && this.nextSibling.element) {
            this.parent.element.insertBefore(this.node, this.nextSibling.element)
        } else {
            this.parent.element.appendChild(this.node)
        }

        this.update(context, delay)
    }

    update (context: object, delay: Delay) {
        const r = this.helpers.map(h => h.render(context))
        if (r.some(rr => rr[0] === ChangeType.CHANGED)) {
            this.node.data = r.map(rr => rr[1]).join(' ')
        }
    }

    destroy () {
        if (!this.rendered) return
        this.parent.element.removeChild(this.node)
        this.rendered = false
    }

    create () {
        return null
    }
}
