import { Tag } from './tag'
import { Context, Waiter } from './context'

export function setAttribute(el: Element, attr: [string, any, boolean]) {
    if (attr[2]) {
        el.setAttribute(attr[0], attr[1])
        return
    }
    el[attr[0]] = attr[1]
}

export class StaticTag extends Tag {
    name: string
    as: [string, any, boolean][] = []
    inSvg: boolean = false

    constructor(name: string, id: string) {
        super(id)
        this.name = name
        this.inSvg = name === 'svg'
    }

    attr (name: string, value: any, useSet?: boolean) {
        this.as.push([name, value, useSet === true])
    }

    init (ctx: Context, waiter: Waiter) {
        if (this.inSvg) ctx.startSvg()
        ctx.setEl(this.id, this.create(ctx))
        super.init(ctx, waiter)
        if (this.inSvg) ctx.endSvg()
    }

    render (ctx: Context, waiter: Waiter) {
        this.parent.append(ctx, ctx.getEl(this.id))
        this.children.render(ctx, waiter)
    }

    update (ctx: Context, waiter: Waiter) {
        this.children.update(ctx, waiter)
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        if (domRemove) {
            this.parent.remove(ctx, ctx.getEl(this.id))
        }
        ctx.setEl(this.id, null)

        this.children.destroy(ctx, waiter, false)
    }

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {
        const ee = ctx.getEl(this.id)
        if (anchor) {
            ee.insertBefore(el, anchor)
            return
        }
        ee.appendChild(el)
    }

    remove (ctx: Context, el: Element | Comment) {
        ctx.getEl(this.id).removeChild(el)
    }

    create (ctx: Context): Element {
        // const element = ctx.isInSvg() ?
        //     document.createElementNS('http://www.w3.org/2000/svg', this.name) :
        //     document.createElement(this.name)

        const element = ctx.createElement(this.name)
        this.as.forEach(it => setAttribute(element, it))
        return element
    }
}
