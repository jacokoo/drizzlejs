import { BlockTag } from './block-tag'
import { Context, Waiter, ElementContainer } from './context'

export interface Slot {
    get (): Promise<ElementContainer>
    setCleaner (sc: SlotCleaner)
    render (): Promise<any>
}

export type SlotCleaner = (w: Waiter) => void

// when slot-tag within a reference-tag then all its children are render to target slot
// otherwise it defines a slot
// slot can not be defined in an each-tag
export class SlotTag extends BlockTag {
    constructor(id: string, needAnchor: boolean) {
        super(id, needAnchor)
    }

    init (ctx: Context, waiter: Waiter) {
        super.init(ctx, waiter)
        const me = this
        const slot = {
            get (): Promise<ElementContainer> {
                const w = new Waiter()
                slot.clear(w)
                return w.end().then(() => me)
            },

            clear (w: Waiter) {
                const c = ctx.cache.get(me.id) as SlotCleaner
                if (c) {
                    c(w)
                    ctx.cache.clear(me.id)
                }
            },

            render (): Promise<any> {
                const w = new Waiter()
                slot.clear(w)
                me.showChildren(ctx, w)
                ctx.cache.set(me.id, (wa: Waiter) => {
                    me.clearChildren(ctx, wa)
                })
                return w.end()
            },

            setCleaner (sc: SlotCleaner) {
                ctx.cache.set(me.id, sc)
            }
        }

        ctx.slot(this.id, slot)
    }

    clearChildren (ctx: Context, waiter: Waiter) {
        ctx.cache.clear(`${this.id}c`)
        this.children.destroy(ctx, waiter, true)
    }

    showChildren (ctx: Context, waiter: Waiter) {
        ctx.cache.set(`${this.id}c`, true)
        const w = new Waiter()
        ctx.cache.set(this.id, 1)
        this.children.init(ctx, w)
        this.children.render(ctx, w)
        waiter.wait(w.end)
    }

    // render is taken by the slot
    // if children are shown, update them
    update (ctx: Context, waiter: Waiter) {
        const ts = ctx.cache.get(`${this.id}c`)
        if (ts) {
            this.children.update(ctx, waiter)
        }
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        const ts = ctx.cache.get(this.id)
        if (ts) {
            this.children.destroy(ctx, waiter, domRemove)
        }
        ctx.cache.clear(this.id)
        super.destroy(ctx, waiter, domRemove)
    }
}
