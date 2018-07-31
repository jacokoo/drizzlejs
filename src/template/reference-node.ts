import { Node } from './node'
import { Renderable } from '../renderable'
import { Delay, Attribute, resolveEventArgument, Updatable } from './template'
import { Module } from '../module'
import { View } from '../view'
import { StaticNode } from './static-node'

export class ReferenceNode extends Node {
    name: string
    item: Module | View
    events: {[method: string]: {event: string, args: Attribute[]}} = {}
    actions: {[method: string]: {event: string, args: Attribute[]}} = {}
    bindings: [string, string][] = []
    grouped: {[name: string]: Node[]} = {}

    hooks: Updatable[] = []

    constructor(name: string, id?: string) {
        super(id)
        this.name = name
    }

    bind (from: string, to?: string) {
        this.bindings.push([from, to || from])
    }

    on (event: string, method: string, args: Attribute[]) {
        this.events[method] = {event, args}
    }

    action (event: string, method: string, args: Attribute[]) {
        this.actions[method] = {event, args}
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        const fn = (i: Module | View) => {
            this.item = i
            if (this.id) root.ids[this.id] = i
        }
        if (root instanceof View) {
            delay.add(root._module.createItem(this.name).then(fn))
        } else {
            delay.add((root as Module).createItem(this.name).then(fn))
        }

        this.children.forEach(it => {
            let name = 'default'
            if (it instanceof StaticNode) {
                const attr = (it.attributes as [string, string][]).find(n => n[0] === 'region')
                if (attr) name = attr[1]
            }

            if (!this.grouped[name]) this.grouped[name] = []
            this.grouped[name].push(it)
        })
    }

    render (context: object, delay: Delay) {
        delay.add(this.item.set(this.bindings.reduce((acc, item) => {
            acc[item[1]] = context[item[0]]
            return acc
        }, {})))
        delay.add(this.item._render(this.parent.element, this.nextSibling && this.nextSibling.element).then(() => {
            return Promise.all(Object.keys(this.grouped).map(k => {
                return this.item.regions[k]._showNode(this.grouped[k], context)
            }))
        }))

        if ((this.root instanceof View) && (this.item instanceof Module)) {
            this.hooks = this.bindEventsAndActions(this.root, this.item, context)
        }
    }

    bindEventsAndActions (root: View, target: Module, context: object) {
        const obj = {context}
        const {events, actions} = root._options
        const me = this

        const ecbs = Object.keys(this.events).map(it => {
            const cb = function (this: Module, event: any) {
                const data = resolveEventArgument(this, obj.context, me.events[it].args, event)
                events[it].apply(root, data)
            }
            return {fn: cb, event: me.events[it].event}
        })

        const acbs = Object.keys(this.actions).map(it => {
            const cb = function(this: Module, event: any) {
                const data = resolveEventArgument(this, obj.context, me.actions[it].args, event)
                const dispacher = (d) => root._module.dispatch(it, d)
                actions && actions[it] ? actions[it].apply(root, [dispacher].concat(data)) : dispacher(data[0])
            }
            return {fn: cb, event: me.actions[it].event}
        })

        return ecbs.concat(acbs).map(it => Object.assign(target.on(it.event, it.fn), {
            update (ctx: object) {
                obj.context = ctx
            }
        }))
    }

    update (context: object, delay: Delay) {
        delay.add(this.item.set(this.bindings.reduce((acc, item) => {
            acc[item[1]] = context[item[0]]
            return acc
        }, {})))

        this.hooks.forEach(it => it.update(context))
        this.children.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        delay.add(this.item.destroy())
        this.hooks.forEach(it => it.dispose())
        this.hooks = []
        delay.add(Promise.all(Object.keys(this.grouped).map(it => {
            return this.item.regions[it].close()
        })))
        this.rendered = false
    }

    create () {
        return null
    }
}
