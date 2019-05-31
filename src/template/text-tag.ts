import { Tag } from './tag'
import { Context, Waiter, ElementContainer } from './context'
import { ChangeType } from './common'

interface TextItem {
    parent: ElementContainer
    init (ctx: Context)
    render (ctx: Context)
    update (ctx: Context)
    destroy (ctx: Context, domRemove: boolean)
}

class Static implements TextItem {
    parent: Tag
    id: string
    value: any

    constructor (id: string, value: any) {
        this.id = id
        this.value = value
    }

    init (ctx: Context) {
        ctx.setEl(this.id, document.createTextNode(this.value))
    }

    render (ctx: Context) {
        this.parent.append(ctx, ctx.getEl(this.id))
    }

    update (ctx: Context) {}

    destroy (ctx: Context, domRemove: boolean) {
        if (domRemove) {
            this.parent.remove(ctx, ctx.getEl(this.id))
        }
        ctx.setEl(this.id, null)
    }
}

class Dynamic extends Static {
    render (ctx: Context) {
        const el = ctx.getEl(this.id) as Text
        const [, v, ] = ctx.get(this.value)
        el.data = v

        super.render(ctx)
    }

    update (ctx: Context) {
        const el = ctx.getEl(this.id) as Text
        const [changed, v, ] = ctx.get(this.value)
        if (changed === ChangeType.CHANGED) el.data = v
    }
}

class Html extends Static {
    init (ctx: Context) {
        ctx.setEl(this.id, document.createElement('noscript'))
        ctx.setEl(`${this.id}e`, document.createElement('noscript'))
    }

    render (ctx: Context) {
        super.render(ctx)
        this.parent.append(ctx, ctx.getEl(`${this.id}e`))
        this.update(ctx)
    }

    update (ctx: Context) {
        const start = ctx.getEl(this.id) as HTMLElement
        const end = ctx.getEl(`${this.id}e`)

        const [changed, v, ] = ctx.get(this.value)
        if (changed === ChangeType.NOT_CHANGED) return

        while (start.nextSibling && start.nextSibling !== end) {
            start.parentNode.removeChild(start.nextSibling)
        }

        start.insertAdjacentHTML('afterend', v)
    }

    destroy (ctx: Context, domRemove: boolean) {
        if (domRemove) {
            const start = ctx.getEl(this.id) as HTMLElement
            const end = ctx.getEl(`${this.id}e`)
            while (start.nextSibling && start.nextSibling !== end) {
                start.parentNode.removeChild(start.nextSibling)
            }
        }
        ctx.setEl(`${this.id}e`, null)
        super.destroy(ctx, domRemove)
    }
}

export class TextTag extends Tag {
    items: TextItem[]

    constructor (id: string, items: [number, string][], ref?: string) {
        super(id, ref)
        this.items = items. map((it, i) => {
            const iid = `${this.id}${i}`
            if (it[0] === 2) return new Html(iid, it[1])
            if (it[0] === 1) return new Dynamic(iid, it[1])
            return new Static(iid, it[1])
        })
    }

    init (ctx: Context, waiter: Waiter) {
        this.items.forEach(it => {
            it.parent = this.parent
            it.init(ctx)
        })
    }

    render (ctx: Context, waiter: Waiter) {
        this.items.forEach(it => it.render(ctx))
    }

    update (ctx: Context, waiter: Waiter) {
        this.items.forEach(it => it.update(ctx))
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        this.items.forEach(it => it.destroy(ctx, domRemove))
    }

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {}
    remove (ctx: Context, el: Element | Comment) {}
}
