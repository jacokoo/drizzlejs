import { Tag } from './tag'
import { Context, Waiter } from './context'

export abstract class BlockTag extends Tag {
    needAnchor: boolean = false

    constructor (id: string, needAnchor: boolean, ref?: string) {
        super(id, ref)
        this.needAnchor = needAnchor
    }

    init (ctx: Context, waiter: Waiter) {
        if (this.needAnchor) {
            const anchor = document.createComment(Object.getPrototypeOf(this).constructor.name)
            ctx.setEl(this.id, anchor)
        }
        super.init(ctx, waiter)
    }

    render (ctx: Context, waiter: Waiter) {
        if (!this.needAnchor) return
        this.parent.append(ctx, ctx.getEl(this.id))
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        this.children.destroy(ctx, waiter, domRemove)
        if (!this.needAnchor) return
        if (domRemove) {
            this.parent.remove(ctx, ctx.getEl(this.id))
        }
        ctx.setEl(this.id, null)
    }

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {
        if (this.needAnchor && !anchor) {
            anchor = ctx.getEl(this.id) as Comment
        }
        this.parent.append(ctx, el, anchor)
    }

    remove (ctx: Context, el: Element | Comment) {
        this.parent.remove(ctx, el)
    }

    abstract update (ctx: Context, waiter: Waiter)
}
