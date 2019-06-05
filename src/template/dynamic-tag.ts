import { StaticTag, setAttribute } from './static-tag'
import { Context, Waiter, EventTarget, ViewContext } from './context'
import { ChangeType} from './common'

export class DynamicTag extends StaticTag {
    das: [string, string, boolean][] = []
    evs: string[]
    widgets: string[]

    constructor (name: string, id: string, events: string[] = [], widgets: string[] = []) {
        super(name, id)
        this.evs = events
        this.widgets = widgets
    }

    dattr (name: string, helperId: string, useSet?: boolean) {
        this.das.push([name, helperId, useSet === true])
    }

    render (ctx: Context, waiter: Waiter) {
        super.render(ctx, waiter)
        this.updateAttrs(ctx)
        if (!this.evs.length && !this.widgets.length) return

        const el = ctx.getEl(this.id) as Element
        if (this.evs.length || this.widgets.length) {
            const ee = ctx.fillState(el)
            this.evs.forEach(it => ctx.bind(false, ee, it))
        }
        this.widgets.forEach(it => (ctx as ViewContext).widget(0, el, it))
    }

    update (ctx: Context, waiter: Waiter) {
        super.update(ctx, waiter)
        this.updateAttrs(ctx)
        if (!this.evs.length && !this.widgets.length) return
        const el = ctx.getEl(this.id) as Element
        if (this.evs.length) ctx.fillState(el)

        this.widgets.forEach(it => (ctx as ViewContext).widget(1, el, it))
    }

    updateAttrs (ctx: Context) {
        const el = ctx.getEl(this.id)
        this.das.forEach(it => {
            const v = ctx.get(it[1])
            if (v[0] === ChangeType.CHANGED) {
                setAttribute(el as Element, [it[0], v[1], it[2]])
            // TODO temporally solve a bug
            } else if (this.name === 'input' && it[0] === 'checked') {
                setAttribute(el as Element, [it[0], v[1], it[2]])
            }
        })
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        if (this.evs.length || this.widgets.length) {
            const el = ctx.getEl(this.id) as Element
            this.evs.forEach(it => ctx.bind(true, el as any as EventTarget, it))
            this.widgets.forEach(it => (ctx as ViewContext).widget(2, el, it))
        }
        super.destroy(ctx, waiter, domRemove)
    }
}
