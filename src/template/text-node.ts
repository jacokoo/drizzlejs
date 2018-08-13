import { Delay, ChangeType, Appendable } from './template'
import { Helper, DelayTransfomer } from './helper'
import { Renderable } from '../renderable'
import { View } from '../view'
import { AnchorNode } from './anchor-node'

export class TextNode extends AnchorNode {
    helpers: Helper[]
    node: Text
    newParent: Appendable

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
        super.render(context, delay)
        this.newParent.append(this.node)

        this.update(context, delay)
    }

    update (context: object, delay: Delay) {
        const r = this.helpers.map(h => h.render(context))
        if (r.some(rr => rr[0] === ChangeType.CHANGED)) {
            this.node.data = r.map(rr => rr[1]).join(' ')
        }
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)
        this.rendered = false
    }

    create () {
        return null
    }
}
