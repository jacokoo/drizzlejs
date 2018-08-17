import { Node as MNode } from './node'
import { Appendable, Delay } from './template'

export abstract class AnchorNode extends MNode {
    newParent: Appendable
    anchor: Node

    constructor (id?: string) {
        super(id)
        this.anchor = document.createComment('')
    }

    render (context: object, delay: Delay) {
        super.render(context, delay)
        if (!this.newParent) {
            this.parent.append(this.anchor)
            this.newParent = this.parent.before(this.anchor)
        }
    }

    destroy (delay: Delay) {
        super.destroy(delay)

        this.parent.remove(this.anchor)
        this.newParent = null
    }
}
