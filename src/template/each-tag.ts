import { BlockTag } from './block-tag'
import { Context, Waiter } from './context'
import { Tags, emptyTags } from './tag'
import { EachDef, ChangeType } from './common'

const toKeys = (list: any): EachKey[] => {
    if (!list) return []
    return Array.isArray(list) ? list.map((it, i) => i) : Object.keys(list)
}

export type EachKey = string | number

export class EachTag extends BlockTag {
    def: EachDef
    loopPart: Tags
    falsePart: Tags

    constructor (id: string, needAnchor: boolean, def: EachDef, loopPart: Tags, falsePart?: Tags) {
        super(id, needAnchor)
        this.def = def
        this.loopPart = loopPart
        this.falsePart = falsePart || emptyTags
    }

    init (ctx: Context, waiter: Waiter) {
        this.loopPart.forEach(it => it.parent = this)
        this.falsePart.forEach(it => it.parent = this)
        super.init(ctx, waiter)
    }

    render (ctx: Context, waiter: Waiter) {
        super.render(ctx, waiter)

        const [, list] = ctx.get(this.def.name)
        const kv = toKeys(list)
        if (!kv.length) {
            this.renderElse(ctx, waiter)
            return
        }
        this.doEach(ctx, kv, () => this.renderBody(ctx, waiter))
    }

    update (ctx: Context, waiter: Waiter) {
        const [changed, list, old] = ctx.get(this.def.name)
        const lkv = toKeys(list)
        const okv = toKeys(old)
        const le = !lkv.length
        const oe = !okv.length

        if (le && oe) {
            this.falsePart.update(ctx, waiter)
            return
        }

        if (changed === ChangeType.NOT_CHANGED) {
            this.doEach(ctx, lkv, () => this.loopPart.update(ctx, waiter))
            return
        }

        if (!oe && le) {
            this.doEach(ctx, okv, () => this.loopPart.destroy(ctx, waiter, true), true)
            this.renderElse(ctx, waiter)
            return
        }

        if (oe && !le) {
            this.falsePart.destroy(ctx, waiter, true)
            this.doEach(ctx, lkv, () => this.renderBody(ctx, waiter))
            return
        }

        if (lkv.length === okv.length) {
            this.doEach(ctx, lkv, () => this.loopPart.update(ctx, waiter))
            return
        }

        if (lkv.length < okv.length) {
            this.doEach(ctx, lkv, () => this.loopPart.update(ctx, waiter))
            this.doEach(ctx, okv.slice(lkv.length), () => this.loopPart.destroy(ctx, waiter, true), true)
            return
        }

        this.doEach(ctx, lkv.slice(0, okv.length), () => this.loopPart.update(ctx, waiter))
        this.doEach(ctx, lkv.slice(okv.length), () => this.renderBody(ctx, waiter))
    }

    renderElse (ctx: Context, waiter: Waiter) {
        const w = new Waiter()
        this.falsePart.init(ctx, w)
        this.falsePart.render(ctx, w)
        waiter.wait(w.end())
    }

    renderBody (ctx: Context, waiter: Waiter) {
        const w = new Waiter()
        this.loopPart.init(ctx, w)
        this.loopPart.render(ctx, w)
        waiter.wait(w.end())
    }

    doEach (ctx: Context, list: EachKey[], fn: (EachKey) => void, remove: boolean = false) {
        ctx.cache.push(this.id, this.def)
        list.forEach(it => {
            const d = ctx.cache.next(it)
            fn(it)
            if (remove) d.dispose()
        })
        ctx.cache.pop()
    }

    destroy (ctx: Context, waiter: Waiter, domRemove: boolean) {
        const [changed, list, old] = ctx.get(this.def.name)
        const kv = changed === ChangeType.NOT_CHANGED ? toKeys(list) : toKeys(old)
        this.doEach(ctx, kv, () => this.loopPart.destroy(ctx, waiter, domRemove), true)
        if (!kv.length) this.falsePart.destroy(ctx, waiter, domRemove)
        super.destroy(ctx, waiter, domRemove)
    }
}
