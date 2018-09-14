import { Node as MNode } from './node'
import { Appendable } from './template'
import { DataContext, Context } from './context'

export abstract class AnchorNode extends MNode {
    newParent: Appendable
    anchor: Node

    constructor (id?: string) {
        super(id)
    }

    render (context: DataContext) {
        super.render(context)
        if (!this.newParent) {
            if (this.nextSibling) {
                this.anchor = document.createComment(Object.getPrototypeOf(this).constructor.name)
                this.parent.append(this.anchor)
                this.newParent = this.parent.before(this.anchor)
            } else {
                this.newParent = this.parent
            }
        }
    }

    destroy (context: Context) {
        super.destroy(context)

        if (this.anchor) this.parent.remove(this.anchor)
        this.newParent = null
    }
}
