import { Node } from './node'
import { Attribute } from './template'
import { Module } from '../module'
import { View } from '../view'
import { StaticNode } from './static-node'
import { Disposable } from '../drizzle'
import { AnchorNode } from './anchor-node'
import { getValue, resolveEventArgument } from './util'
import { Context, DataContext } from './context'

interface BindResult {
    fn: (any) => void
    event: string
}

export class ReferenceNode extends AnchorNode {
    name: string
    item: Module | View
    events: {[event: string]: {method: string, args: Attribute[]}} = {}
    actions: {[event: string]: {method: string, args: Attribute[]}} = {}
    mappings: [string, string][] = []
    grouped: {[name: string]: Node[]} = {}
    statics: {[name: string]: any} = {}

    hooks: Disposable[] = []
    context: DataContext

    constructor(name: string, id?: string) {
        super(id)
        this.name = name
    }

    attribute (name: string, value: any) {
        this.statics[name] = value
    }

    map (from: string, to?: string) {
        this.mappings.push([from, to || from])
    }

    on (event: string, method: string, args: Attribute[]) {
        this.events[event] = {method, args}
    }

    action (event: string, method: string, args: Attribute[]) {
        this.actions[event] = {method, args}
    }

    init (context: Context) {
        const fn = (i: Module | View) => {
            this.item = i
            if (this.id) context.ref(this.id, i)
        }

        context.create(this.name, this.statics).then(fn)

        this.children.forEach(it => {
            let name = 'default'
            if (it instanceof StaticNode) {
                const attr = (it.attributes as [string, string][]).find(n => n[0] === 'region')
                if (attr) name = attr[1]
            }

            it.init(context)
            if (!this.grouped[name]) this.grouped[name] = []
            this.grouped[name].push(it)
        })
    }

    render (context: DataContext) {
        if (this.rendered) return
        this.rendered = true

        super.render(context)
        context.delay(this.item.set(this.mappings.reduce((acc, item) => {
            acc[item[1]] = getValue(item[0], context)
            return acc
        }, {})))
        context.delay(this.item._render(this.newParent).then(() => {
            return Promise.all(Object.keys(this.grouped).map(k => {
                if (!this.item.regions[k]) return
                return this.item.regions[k]._showNode(this.grouped[k], context)
            }).concat(Object.keys(this.item.regions).map(it => {
                if (!this.grouped[it] || !this.grouped[it].length) return this.item.regions[it]._showChildren()
            })))
        }))

        this.context = context
        let cbs = []
        if (this.item instanceof Module) {
            const m = this.item
            cbs = cbs.concat(this.bindEvents(context))
            cbs = cbs.concat(this.bindActions(context))

            this.hooks = cbs.map(it => m.on(it.event, it.fn))
        }
    }

    bindEvents (context: DataContext): BindResult[] {
        const me = this

        return Object.keys(this.events).map(it => {
            const cb = function (this: Module, event: any) {
                const data = resolveEventArgument(this, me.context, me.events[it].args, event)
                context.trigger(me.events[it].method, ...data)
            }
            return {fn: cb, event: it}
        })
    }

    bindActions (context: DataContext): BindResult[] {
        const me = this

        return Object.keys(this.actions).map(it => {
            const cb = function(this: Module, event: any) {
                const data = resolveEventArgument(this, me.context, me.actions[it].args, event)
                context.dispatch(me.actions[it].method, ...data)
            }
            return {fn: cb, event: it}
        })
    }

    update (context: DataContext) {
        context.delay(this.item.set(this.mappings.reduce((acc, item) => {
            acc[item[1]] = getValue(item[0], context)
            return acc
        }, {})))

        this.context = context
        this.children.forEach(it => it.update(context))
    }

    destroy (delay: Context) {
        if (!this.rendered) return
        super.destroy(delay)

        this.context.delay(this.item.destroy())
        this.hooks.forEach(it => it.dispose())
        this.hooks = []
        this.context.delay(Promise.all(Object.keys(this.grouped).map(it => {
            if (!this.item.regions[it]) return
            return this.item.regions[it].close()
        })))
        this.rendered = false
    }

}
