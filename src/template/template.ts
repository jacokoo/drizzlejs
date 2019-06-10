import { Tag, Tags } from './tag'
import {
    Helper, Context, Waiter, ViewContext, ComponentContext, ElementContainer, EventDef, EventTarget
} from './context'
import { Lifecycle } from '../lifecycle'
import { Renderable } from '../renderable'
import { View } from '../view'
import { Component } from '../component'
import { WidgetDef, RefDef } from './common'
import { Binding } from './binding'

const TargetKey = '_t_'

class RootParent implements ElementContainer {
    target: ElementContainer

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {
        if (!this.target) {
            this.target = ctx.cache.get(TargetKey)
        }
        this.target.append(ctx, el, anchor)
    }

    remove (ctx: Context, el: Element | Comment) {
        if (!this.target) {
            this.target = ctx.cache.get(TargetKey)
        }
        this.target.remove(ctx, el)
    }
}

export class ElementParent implements ElementContainer {
    el: HTMLElement

    constructor (el: HTMLElement) {
        this.el = el
    }

    append (ctx: Context, el: Element | Comment, anchor?: Comment) {
        if (anchor) {
            this.el.insertBefore(el, anchor)
            return
        }

        this.el.appendChild(el)
    }

    remove (ctx: Context, el: Element | Comment) {
        this.el.removeChild(el)
    }
}

export abstract class Template {
    tags: {[id: string]: Tag} = {}
    events: {[id: string]: EventDef} = {}
    helpers: {[id: string]: Helper} = {}
    refs: {[name: string]: RefDef} = {}
    root: Tags

    constructor (root: Tags) {
        this.root = root
    }

    tag (...ts: Tag[]) {
        ts.forEach(it => this.tags[it.id] = it)
    }

    event (id: string, def: EventDef) {
        def.fn = function (this: EventTarget, e: any) {
            this._ctx.trigger(def, this, e)
        }
        def.on = function (this: null, el: EventTarget) {
            el.addEventListener(def.name, def.fn, false)
        }
        def.off = function (this: null, el: EventTarget) {
            el.removeEventListener(def.name, def.fn, false)
        }
        this.events[id] = def
    }

    helper (id: string, helper: Helper) {
        this.helpers[id] = helper
    }

    ref (name: string, def: RefDef) {
        this.refs[name] = def
    }

    abstract context (root: Renderable<any>): Context

    create (): Lifecycle {
        const me = this
        const o = {
            context: null as Context,
            stage: 'template',
            init (this: Renderable<any>) {
                o.context = me.context(this)
                this._refs = o.context
                const w = new Waiter()
                const p = new RootParent()
                me.root.forEach(it => {
                    it.parent = p
                    it.init(o.context, w)
                })
                return w.end()
            },

            rendered (this: Renderable<any>, data: any) {
                o.context.set(data)
                o.context.cache.set(TargetKey, this._target)
                const w = new Waiter()
                me.root.render(o.context, w)
                return w.end()
            },

            updated (this: Renderable<any>, data: any) {
                o.context.set(data)
                const w = new Waiter()
                me.root.update(o.context, w)
                return w.end()
            },

            destroyed (this: Renderable<any>) {
                const w = new Waiter()
                me.root.destroy(o.context, w, true)
                return w.end()
            }
        }

        return o as Lifecycle
    }
}

export class ViewTemplate extends Template {
    widgets: {[id: string]: WidgetDef} = {}
    bindings: {[id: string]: Binding} = {}

    widget (id: string, def: WidgetDef) {
        this.widgets[id] = def
    }

    binding (id: string, def: Binding) {
        this.bindings[id] = def
    }

    context (root: Renderable<any>): Context {
        return new ViewContext(root as View, this)
    }
}

export class ComponentTemplate extends Template {
    exportedModels: string[] = []

    constructor(root: Tags, exportedModels: string[]) {
        super(root)
        this.exportedModels = exportedModels
    }

    context (root: Renderable<any>): Context {
        return new ComponentContext(root as Component, this)
    }
}
