import { Node } from './node'
import { Renderable } from '../renderable'
import { Delay, Attribute, resolveEventArgument, getValue } from './template'
import { Module } from '../module'
import { View } from '../view'
import { StaticNode } from './static-node'
import { Disposable } from '../drizzle'
import { AnchorNode } from './anchor-node'

interface BindResult {
    fn: (any) => void
    event: string
}

export class ReferenceNode extends AnchorNode {
    name: string
    item: Module | View
    events: {[event: string]: {method: string, args: Attribute[]}} = {}
    actions: {[event: string]: {method: string, args: Attribute[]}} = {}
    bindings: [string, string][] = []
    grouped: {[name: string]: Node[]} = {}
    statics: {[name: string]: any} = {}

    hooks: Disposable[] = []
    context: object

    constructor(name: string, statics: {[name: string]: any}, id?: string) {
        super(id)
        this.name = name
        this.statics = statics
    }

    bind (from: string, to?: string) {
        this.bindings.push([from, to || from])
    }

    on (event: string, method: string, args: Attribute[]) {
        this.events[event] = {method, args}
    }

    action (event: string, method: string, args: Attribute[]) {
        this.actions[event] = {method, args}
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        const fn = (i: Module | View) => {
            this.item = i
            if (this.id) root.ids[this.id] = i
        }
        if (root instanceof View) {
            delay.add(root._module._createItem(this.name).then(fn))
        } else {
            delay.add((root as Module)._createItem(this.name).then(fn))
        }

        this.children.forEach(it => {
            let name = 'default'
            if (it instanceof StaticNode) {
                const attr = (it.attributes as [string, string][]).find(n => n[0] === 'region')
                if (attr) name = attr[1]
            }

            it.init(root, delay)
            if (!this.grouped[name]) this.grouped[name] = []
            this.grouped[name].push(it)
        })
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true

        super.render(context, delay)
        delay.add(this.item.set(Object.assign({}, this.statics, this.bindings.reduce((acc, item) => {
            acc[item[1]] = getValue(item[0], context)
            return acc
        }, {}))))
        delay.add(this.item._render(this.newParent).then(() => {
            return Promise.all(Object.keys(this.grouped).map(k => {
                return this.item.regions[k]._showNode(this.grouped[k], context)
            }).concat(Object.keys(this.item.regions).map(it => {
                if (!this.grouped[it] || !this.grouped[it].length) return this.item.regions[it]._showChildren()
            })))
        }))

        this.context = context
        let cbs = []
        if (this.item instanceof Module) {
            const m = this.item
            cbs = cbs.concat(this.bindEvents(this.root, m, context))
            cbs = cbs.concat(this.bindActions(this.root, m, context))

            this.hooks = cbs.map(it => m.on(it.event, it.fn))
        }
    }

    bindEvents (root: Renderable<any>, target: Module, context: object): BindResult[] {
        const me = this
        const obj = {context}

        return Object.keys(this.events).map(it => {
            const cb = function (this: Module, event: any) {
                const data = resolveEventArgument(this, obj.context, me.events[it].args, event)
                root._event(me.events[it].method, ...data)
            }
            return {fn: cb, event: it, update: (ctx) => obj.context = ctx}
        })
    }

    bindActions (root: Renderable<any>, target: Module, context: object): BindResult[] {
        const me = this

        return Object.keys(this.actions).map(it => {
            const cb = function(this: Module, event: any) {
                const data = resolveEventArgument(this, me.context, me.actions[it].args, event)
                root._action(me.actions[it].method, ...data)
            }
            return {fn: cb, event: it}
        })
    }

    update (context: object, delay: Delay) {
        delay.add(this.item.set(this.bindings.reduce((acc, item) => {
            acc[item[1]] = getValue(item[0], context)
            return acc
        }, {})))

        this.context = context
        this.children.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)

        delay.add(this.item.destroy())
        this.hooks.forEach(it => it.dispose())
        this.hooks = []
        delay.add(Promise.all(Object.keys(this.grouped).map(it => {
            return this.item.regions[it].close()
        })))
        this.rendered = false
    }

}
