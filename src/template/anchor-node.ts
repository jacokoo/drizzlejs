import { Node as MNode } from './node'
import { Appendable } from './template'
import { DataContext, Context } from './context'

export abstract class AnchorNode extends MNode {
    newParent: Appendable
    anchor: Node

    constructor (id?: string) {
        super(id)
        this.anchor = document.createComment('')
    }

    render (context: DataContext) {
        super.render(context)
        if (!this.newParent) {
            this.parent.append(this.anchor)
            this.newParent = this.parent.before(this.anchor)
        }
    }

    destroy (context: Context) {
        super.destroy(context)

        this.parent.remove(this.anchor)
        this.newParent = null
    }
}
