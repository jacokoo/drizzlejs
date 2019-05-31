import { StaticTag, setAttribute } from './static-tag'
import { Context, Waiter, EventTarget } from './context'
import { ChangeType, EachState} from './common'

export class DynamicTag extends StaticTag {
    das: [string, string, boolean][] = []
    evs: string[]

    constructor (name: string, id: string, events: string[] = [], ref?: string) {
        super(name, id, ref)
        this.evs = events
    }

    dattr (name: string, helperId: string, useSet?: boolean) {
        this.das.push([name, helperId, useSet === true])
    }

    render (ctx: Context, waiter: Waiter) {
        super.render(ctx, waiter)
        this.updateAttrs(ctx)
        if (this.evs.length) {
            const el = ctx.fillState(ctx.getEl(this.id) as Element)
            this.evs.forEach(it => ctx.bind(false, el, it))
        }
    }

    update (ctx: Context, waiter: Waiter) {
        super.update(ctx, waiter)
        this.updateAttrs(ctx)
        ctx.fillState(ctx.getEl(this.id) as Element)
    }

    updateAttrs (ctx: Context) {
        const el = ctx.getEl(this.id)
        this.das.forEach(it => {
            const v = ctx.get(it[1])
            if (v[0] === ChangeType.CHANGED) {
                setAttribute(el as Element, [it[0], v, it[2]])
            }
        })
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        if (this.evs.length) {
            const el = ctx.getEl(this.id) as any as EventTarget
            this.evs.forEach(it => ctx.bind(true, el, it))
        }
        super.destroy(ctx, waiter, domRemove)
    }
}
