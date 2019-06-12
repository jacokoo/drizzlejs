import { BlockTag } from './block-tag'
import { Tags } from './tag'
import { Context, Waiter, EventTarget, ElementContainer } from './context'
import { Component } from '../component'
import { View } from '../view'

class ReferenceContainer implements ElementContainer {
    ctx: Context
    target: ElementContainer

    constructor (ctx: Context, target: ElementContainer) {
        this.ctx = ctx
        this.target = target
    }

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {
        this.target.append(this.ctx, el, anchor)
    }

    remove (ctx: Context, el: Element | Comment) {
        this.target.remove(this.ctx, el)
    }
}

export class ReferenceTag extends BlockTag  {
    name: string
    events: string[]

    slots: {[id: string]: Tags} = {}
    attrs: object = {}
    mappings: [string, string][] // [name, helper-id]

    constructor (id: string, needAnchor: boolean, name: string, events: string[] = [], mps: [string, string][] = []) {
        super(id, needAnchor)
        this.name = name
        this.events = events
        this.mappings = mps
    }

    attr (name: string, value: any) {
        this.attrs[name] = value
    }

    init (ctx: Context, waiter: Waiter) {
        waiter.wait(ctx.create(this.name, this.attr).then(it => ctx.cache.set(this.id, it)))
        Object.keys(this.slots).forEach(it => this.slots[it].init(ctx, waiter))
        super.init(ctx, waiter)
    }

    render (ctx: Context, waiter: Waiter) {
        super.render(ctx, waiter)

        const item = ctx.cache.get(this.id) as View | Component
        if (this.events.length) {
            const et = ctx.fillState(item)
            this.events.forEach(it => ctx.event(false, et, it))
        }

        waiter.wait(item.set(this.mappings.reduce((acc, it) => {
            const [, v, ] = ctx.get(it[1])
            acc[it[0]] = v
            return acc
        }, {})).then(() => {
            return item._render(new ReferenceContainer(ctx, this))
        }).then(() => {
            Object.keys(this.slots).forEach(s => {
                if (!item.slots[s]) throw new Error(`No slot defined: ${s}`)
            })
            return Promise.all(Object.keys(item.slots).map(it => {
                if (this.slots[it]) {
                    return item.slots[it].get().then(c => {
                        const w = new Waiter()
                        this.slots[it].forEach(s => {
                            s.parent = c
                            s.render(ctx, w)
                        })
                        return w.end()
                    })
                }
                return item.slots[it].render()
            }))
        }))
    }

    update (ctx: Context, waiter: Waiter) {
        const item = ctx.cache.get(this.id) as View | Component
        waiter.wait(item.set(this.mappings.reduce((acc, it) => {
            const [, v, ] = ctx.get(it[1])
            acc[it[0]] = v
            return acc
        }, {})))

        const w = new Waiter()
        Object.keys(this.slots).forEach(it => this.slots[it].update(ctx, w))
        waiter.wait(w.end())
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        const w = new Waiter()
        Object.keys(this.slots).forEach(it => this.slots[it].destroy(ctx, w, domRemove))
        waiter.wait(w.end().then(() => {
            const item = ctx.cache.get(this.id) as View | Component
            if (this.events.length) {
                this.events.forEach(it => ctx.event(true, item as any as EventTarget, it))
            }
            return item.destroy()
        }))
        super.destroy(ctx, waiter, domRemove)
    }
}
