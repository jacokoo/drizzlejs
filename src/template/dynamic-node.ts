import { StaticNode } from './static-node'
import { Helper } from './helper'
import { Disposable } from '../drizzle'
import { View } from '../view'
import { bind } from './binding'
import { Delay, Attribute, ChangeType, resolveEventArgument, Updatable, customEvents } from './template'

export class DynamicNode extends StaticNode {
    dynamicAttributes: {[name: string]: Helper[]} = {}
    events: {[method: string]: {event: string, args: Attribute[]}} = {}
    actions: {[method: string]: {event: string, args: Attribute[]}} = {}
    bindings: [string, string][] = []

    eventHooks: Disposable[]
    actionHooks: Disposable[]
    bindingHooks: Updatable[]

    context: object

    attribute (name: string, ...helpers: Helper[]) {
        this.dynamicAttributes[name] = helpers
    }

    on (event: string, method: string, args: Attribute[]) {
        this.events[method] = {event, args}
    }

    action (event: string, method: string, args: Attribute[]) {
        this.actions[method] = {event, args}
    }

    bind (from: string, to: string) {
        if (!(this.root instanceof View)) return

        this.bindings.push([from, to])
        if (from !== 'group' || this.name.toLowerCase() !== 'input') return
        const attr = this.attributes.find(it => it[0].toLowerCase() === 'type')
        if (!attr) return
        const type = attr[1].toLowerCase()
        if (type !== 'checkbox' && type !== 'radio') return

        const groups = this.root._groups
        if (!groups[to]) groups[to] = {type, items: [], busy: false}
        else if (groups[to].type !== type) {
            throw Error('binding group can not mix up checkbox and radio')
        }
        groups[to].items.push(this) // TODO if this item is hidden by if, should it works?
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        super.render(context, delay)
        this.updateAttributes(context)

        this.context = context
        this.eventHooks = Object.keys(this.events).map(it =>
            this.initEvent(this.events[it].event, it, this.events[it].args)
        )
        this.actionHooks = Object.keys(this.actions).map(it =>
            this.initAction(this.actions[it].event, it, this.actions[it].args)
        )
        this.bindingHooks = this.bindings.map(it => bind(this, this, it[0], it[1])).filter(it => !!it)
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
                const v = it === 'class' ? vvs.join(' ') : vvs.join('') // TODO boolean attribute can be set to string?
                this.element.setAttribute(it, v)
            }
        })
    }

    update (context: object) {
        if (!this.rendered) return

        this.updateAttributes(context)
        this.context = context
        this.bindingHooks.forEach(it => it.update(context))
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
}
