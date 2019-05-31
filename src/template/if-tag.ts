import { BlockTag } from './block-tag'
import { Tags, emptyTags } from './tag'
import { Context, Waiter } from './context'
import { ChangeType } from './common'

export class IfTag extends BlockTag {
    bool: string
    truePart: Tags
    falsePart: Tags

    constructor (id: string, needAnchor: boolean, bool: string, truePart: Tags, falsePart?: Tags) {
        super(id, needAnchor)
        this.bool = bool
        this.truePart = truePart
        this.falsePart = falsePart || emptyTags
    }

    init (ctx: Context, waiter: Waiter) {
        this.truePart.forEach(it => {
            it.parent = this.parent
            it.init(ctx, waiter)
        })
        this.falsePart.forEach(it => {
            it.parent = this.parent
            it.init(ctx, waiter)
        })
        super.init(ctx, waiter)
    }

    render (ctx: Context, waiter: Waiter) {
        super.render(ctx, waiter)

        const [, v] = ctx.get(this.bool)
        this.use(v).render(ctx, waiter)
    }

    update (ctx: Context, waiter: Waiter) {
        const [changed, v, old] = ctx.get(this.bool)
        if (changed === ChangeType.NOT_CHANGED) {
            this.use(v).update(ctx, waiter)
            return
        }

        this.use(old).destroy(ctx, waiter, true)
        this.use(v).render(ctx, waiter)
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        const [, , v] = ctx.get(this.bool)
        this.use(v).destroy(ctx, waiter, domRemove)
        super.destroy(ctx, waiter, domRemove)
    }

    use (v: any): Tags {
        return v ? this.truePart : this.falsePart
    }
}

export class UnlessTag extends IfTag {
    use (v: any): Tags {
        return v ? this.falsePart : this.truePart
    }
}
