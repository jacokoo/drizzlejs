import { Tag } from './tag'
import { Context, Waiter } from './context'

export abstract class BlockTag extends Tag {
    needAnchor: boolean = false
    anid: string

    constructor (id: string, needAnchor: boolean) {
        super(id)
        this.needAnchor = needAnchor
        this.anid = `${id}anchor`
    }

    init (ctx: Context, waiter: Waiter) {
        if (this.needAnchor) {
            const anchor = document.createComment(Object.getPrototypeOf(this).constructor.name || 'anchor')
            ctx.setEl(this.anid, anchor)
        }
        super.init(ctx, waiter)
    }

    render (ctx: Context, waiter: Waiter) {
        if (!this.needAnchor) return
        this.parent.append(ctx, ctx.getEl(this.anid))
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        this.children.destroy(ctx, waiter, domRemove)
        if (!this.needAnchor) return
        if (domRemove) {
            this.parent.remove(ctx, ctx.getEl(this.anid))
        }
        ctx.setEl(this.anid, null)
    }

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {
        if (this.needAnchor && !anchor) {
            anchor = ctx.getEl(this.anid) as Comment
        }
        this.parent.append(ctx, el, anchor)
    }

    remove (ctx: Context, el: Element | Comment) {
        this.parent.remove(ctx, el)
    }

    abstract update (ctx: Context, waiter: Waiter)
}
