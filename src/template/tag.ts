import { Context, Waiter, ElementContainer } from './context'

export class Tags {
    tags: Tag[]

    constructor (tags: Tag[]) { this.tags = tags }
    init (ctx: Context, waiter: Waiter) { this.tags.forEach(it => it.init(ctx, waiter)) }
    render (ctx: Context, waiter: Waiter) { this.tags.forEach(it => it.render(ctx, waiter)) }
    update (ctx: Context, waiter: Waiter) { this.tags.forEach(it => it.update(ctx, waiter)) }
    forEach (fn: (t: Tag, i: number) => void) { this.tags.forEach(fn)}

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        this.tags.forEach(it => it.destroy(ctx, waiter, domRemove))
    }
}

export const emptyTags = new Tags([])

export abstract class Tag implements ElementContainer {
    id: string
    parent: ElementContainer
    children: Tags = emptyTags

    constructor(id: string, ref?: string) {
        this.id = id
    }

    init (ctx: Context, waiter: Waiter) {
        if (this.children) this.children.init(ctx, waiter)
    }

    abstract render (ctx: Context, waiter: Waiter)
    abstract update (ctx: Context, waiter: Waiter)
    abstract destroy (ctx: Context, waiter: Waiter, domRemove: boolean)
    abstract append (ctx: Context, el: Element | Comment, anchor?: Comment)
    abstract remove (ctx: Context, el: Element | Comment)
}
