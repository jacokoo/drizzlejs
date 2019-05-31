import { Template } from './template'
import { Component } from '../component'
import { View } from '../view'
import { getValue, resolveEventArguments } from './value'
import { Cache } from './cache'
import { Slot } from './slot-tag'
import { EachState, HelperResult, ChangeType, CustomTransformer, AttributeValue } from './common'

export interface Helper {
    get (dh: DataContext, state: EachState): any
}

export interface ElementContainer {
    append (ctx: Context, el: Element | Comment, anchor?: Comment)
    remove (ctx: Context, el: Element | Comment)
}

export interface EventTarget extends EachState {
    _ctx: Context
    addEventListener (name: string, fn: (e: any) => void, options: any)
    removeEventListener (name: string, fn: (e: any) => void, options: any)
}

export interface EventDef {
    name: string
    method: string
    attrs: AttributeValue[]
    isAction: boolean
    fn?: (e: any) => void
    binder?: (isUnbind: boolean, el: EventTarget) => void
}

export interface Context {
    cache: Cache
    name (): string // for log

    getEl (key: string): Element | Comment
    setEl (key: string, el: Element | Comment)

    set (data: object)

    // get value of id (helper id)
    get (id: string, state?: EachState): HelperResult

    fillState (el: any): EventTarget

    startSvg (): void
    endSvg (): void
    createElement (name: string): Element

    bind (isUnbind: boolean, el: EventTarget, eventId: string)
    trigger (def: EventDef, el: EventTarget, event: any)
    create (name: string, state?: object): Promise<Component | View>
    slot (id: string, slot: Slot): void
}

export class Waiter {
    busy: any[] = []

    wait (p: any) {
        this.busy.push(p)
    }

    end (): Promise<any> {
        const bs = this.busy
        this.busy = []
        return Promise.all(bs)
    }
}

export abstract class DataContext implements Context {
    root: Component | View
    template: Template
    data: object
    cache: Cache
    version: number = 0

    inSvg: boolean = false

    constructor (root: Component | View, template: Template) {
        this.root = root
        this.template = template
        this.cache = new Cache()
    }

    name (): string {
        return this.root._options._file
    }

    getEl (key: string): Element | Comment {
        return this.cache.get(key)
    }

    setEl (key: string, el: Element | Comment) {
        if (el == null) {
            this.cache.clear(key)
            return
        }
        this.cache.set(key, el)
    }

    get (id: string, state?: EachState): HelperResult {
        const c = this.cache.getCache(state || this.cache)
        const ck = `h_${id}`
        const ex = c[ck] as [number, HelperResult]
        if (ex && ex[0] === this.version) {
            return ex[1]
        }
        const old = ex ? ex[1][1] : null

        const v = this.template.helpers[id].get(this, state || this.cache)
        const type = v === old ? ChangeType.NOT_CHANGED : ChangeType.CHANGED
        const re = [type, v, old] as HelperResult
        c[ck] = [this.version, re]
        return re
    }

    fillState (el: any): EventTarget {
        const es = el as EventTarget
        es._ctx = this
        es._def = this.cache._def.slice()
        es._id = this.cache._id.slice()
        es._state = this.cache._state.slice()
        return es
    }

    startSvg () {
        this.inSvg = true
    }

    endSvg () {
        this.inSvg = false
    }

    createElement (name: string) {
        return this.inSvg ?
            document.createElementNS('http://www.w3.org/2000/svg', name) :
            document.createElement(name)
    }

    bind (isUnbind: boolean, el: EventTarget, eventId: string) {
        const def = this.template.events[eventId]
        const ces = this.root._options.customEvents
        const ce = (ces && ces[def.name]) || this.root.app.options.customEvents[def.name]
        if (ce) {
            ce(isUnbind, el as any as Element, def.fn)
            return
        }
        def.binder(isUnbind, el)
    }

    trigger (def: EventDef, el: EventTarget, event: any) {
        const args = resolveEventArguments(this, el, event, def)
        if (def.isAction) {
            this.root._action(def.method, ...args)
            return
        }
        this.root._event(def.method, ...args)
    }

    set (data: object) {
        this.data = data
        this.version ++
    }

    value (key: string, state: EachState): any {
        return getValue(this, key, state)
    }

    slot (id: string, slot: Slot): void {
        this.root.slots[id] = slot
    }

    abstract transformer (name: string): CustomTransformer | undefined
    abstract create (name: string, state?: object): Promise<Component | View>
}

export class ViewContext extends DataContext {
    transformer (name: string): CustomTransformer | undefined {
        const h = (this.root as View)._options.transformers
        return (h && h[name]) || this.root.app.options.transformers[name]
    }

    create (name: string, state?: object): Promise<Component | View> {
        return (this.root as View)._component._createItem(name, state)
    }
}

export class ComponentContext extends DataContext {
    transformer (name: string): CustomTransformer | undefined {
        return null
    }

    create (name: string, state?: object): Promise<Component | View> {
        return (this.root as Component)._createItem(name, state)
    }
}
