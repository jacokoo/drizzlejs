import { StaticNode } from './static-node'
import { Helper, DelayTransfomer } from './helper'
import { Disposable } from '../drizzle'
import { View } from '../view'
import { bind } from './binding'
import { Delay, Attribute, ChangeType, resolveEventArgument, Updatable, customEvents } from './template'
import { Renderable } from '../renderable'
import { setAttribute } from './attributes'

export class DynamicNode extends StaticNode {
    dynamicAttributes: {[name: string]: Helper[]} = {}
    events: {[event: string]: {method: string, args: Attribute[]}} = {}
    actions: {[event: string]: {method: string, args: Attribute[]}} = {}
    bindings: [string, string][] = []

    eventHooks: Disposable[]
    actionHooks: Disposable[]
    bindingHooks: Updatable[]

    context: object

    attribute (name: string, ...helpers: Helper[]) {
        this.dynamicAttributes[name] = helpers
    }

    on (event: string, method: string, args: Attribute[] = []) {
        this.events[event] = {method, args}
    }

    action (event: string, method: string, args: Attribute[] = []) {
        this.actions[event] = {method, args}
    }

    bind (from: string, to: string) {
        this.bindings.push([from, to])
    }

    init (root: Renderable<any>, delay: Delay) {
        super.init(root, delay)
        if (!(this.root instanceof View)) return

        const view = this.root

        this.bindings.forEach(([from, to]) => {
            if (from !== 'group' || this.name.toLowerCase() !== 'input') return
            const attr = this.attributes.find(it => it[0].toLowerCase() === 'type')
            if (!attr) return
            const type = attr[1].toLowerCase()
            if (type !== 'checkbox' && type !== 'radio') return

            const groups = view._groups
            if (!groups[to]) groups[to] = {type, items: [], busy: false}
            else if (groups[to].type !== type) {
                throw Error('binding group can not mix up checkbox and radio')
            }
            groups[to].items.push(this) // TODO if this item is hidden by if, should it works?
        })

        Object.keys(this.dynamicAttributes).forEach(k => {
            this.dynamicAttributes[k].forEach(it => {
                if (it instanceof DelayTransfomer) {
                    (it as DelayTransfomer).init(view)
                }
            })
        })
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        super.render(context, delay)
        this.updateAttributes(context)

        this.context = context
        this.eventHooks = Object.keys(this.events).map(it =>
            this.initEvent(it, this.events[it].method, this.events[it].args)
        )
        this.actionHooks = Object.keys(this.actions).map(it =>
            this.initAction(it, this.actions[it].method, this.actions[it].args)
        )
        this.bindingHooks = this.bindings.map(it => bind(this, context, it[0], it[1])).filter(it => !!it)
    }

    initEvent (name: string, method: string, args: Attribute[]): Disposable {
        const me = this
        const cb = function(this: HTMLElement, event) {
            const as = resolveEventArgument(this, me.context, args, event)
            me.root._event(method, ...as)
        }

        return this.bindEvent(name, cb)
    }

    initAction (name: string, action: string, args: Attribute[]): Disposable {
        if (!(this.root instanceof View)) return
        const me = this

        const cb = function(this: HTMLElement, event) {
            const data = resolveEventArgument(this, me.context, args, event)
            const root = (me.root as View)
            root._action(action, ...data)
        }

        return this.bindEvent(name, cb)
    }

    bindEvent (name: string, cb: (event: any) => void): Disposable {
        let ce = this.root._options.customEvents
        if (!ce || !ce[name]) ce = this.root.app.options.customEvents
        if (!ce || !ce[name]) ce = customEvents
        if (ce && ce[name]) {
            return ce[name](this.element, cb)
        }

        this.element.addEventListener(name, cb, false)
        return {
            dispose: () => {
                this.element.removeEventListener(name, cb, false)
            }
        }
    }

    updateAttributes (context: object) {
        Object.keys(this.dynamicAttributes).forEach(it => {
            const vs = this.dynamicAttributes[it].map(i => i.render(context))
            if (vs.some(i => i[0] === ChangeType.CHANGED)) {
                const vvs = vs.map(i => i[1])
                if (vvs.length === 1) {
                    setAttribute(this.element, it, vvs[0])
                } else {
                    const v = it === 'class' ? vvs.join(' ') : vvs.join('')
                    setAttribute(this.element, it, v)
                }
            }
        })
    }

    update (context: object, delay: Delay) {
        if (!this.rendered) return

        this.updateAttributes(context)
        this.context = context
        this.bindingHooks.forEach(it => it.update(context))
        this.children.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)

        this.bindingHooks.forEach(it => it.dispose())
        this.actionHooks.forEach(it => it.dispose())
        this.eventHooks.forEach(it => it.dispose())

        this.bindingHooks = []
        this.actionHooks = []
        this.eventHooks = []
    }

    clearHelper () {
        Object.keys(this.dynamicAttributes).forEach(it => this.dynamicAttributes[it].forEach(h => h.clear()))
        super.clearHelper()
    }
}
