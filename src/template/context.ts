import { Disposable } from '../drizzle'
import { DynamicNode } from './dynamic-node'
import { Module } from '../module'
import { View } from '../view'
import { Region, Renderable } from '../renderable'

export interface ComponentHook extends Disposable {
    update (...args: any[]): void
}
export type Component = (node: Node, ...args: any[]) => ComponentHook
export const components: {[name: string]: Component} = {}

export type CustomHelper = (...args: any[]) => any
export const helpers: {[name: string]: CustomHelper} = {}

export type CustomEvent = (name: Node, cb: (event: any) => void) => Disposable
export const customEvents: {[name: string]: CustomEvent} = {
    enter (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 13) return
            e.preventDefault()
            cb.call(this, e)
        }
        node.addEventListener('keypress', ee, false)
        return {
            dispose () {
                node.removeEventListener('keypress', ee, false)
            }
        }
    },

    escape (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 27) return
            cb.call(this, e)
        }
        node.addEventListener('keyup', ee, false)
        return {
            dispose () {
                node.removeEventListener('keyup', ee, false)
            }
        }
    }
}

export interface BindingGroup {
    type: 'checkbox' | 'radio'
    items: DynamicNode[]
    busy: boolean
}

export interface Context {
    groups: {[name: string]: BindingGroup}

    name (): string
    create (name: string, state?: object): Promise<Module | View>

    helper (name: string): CustomHelper | undefined
    component (name: string): Component | undefined
    event (name: string): CustomEvent | undefined
    computed (name: string): (any) => any | undefined

    ref (id: string, node?: HTMLElement | Renderable<any>): void
    region (id: string, region: Region): void

    delay (p: Promise<any>): void
    end (): Promise<any>
}

export interface DataContext extends Context {
    data: {[name: string]: any}
    update (data: object): void

    trigger (name: string, ...args: any[]): void
    dispatch (name: string, ...args: any[]): void

    sub (data: {[name: string]: any}): DataContext
}

abstract class AbstractDataContext implements DataContext {
    groups = {}
    data = {}
    busy: Promise<any>[]
    root: Module | View

    constructor (
        root: Module | View, data?: {[name: string]: any},
        groups?: {[name: string]: BindingGroup}, busy?: Promise<any>[]
    ) {
        this.root = root
        this.data = data || {}
        this.groups = groups || {}
        this.busy = busy || []
    }

    name () {
        return this.root._options._file
    }

    update (data: object): void {
        this.root.set(data)
    }

    trigger (name: string, ...args: any[]): void {
        this.root._event(name, ...args)
    }

    dispatch (name: string, ...args: any[]): void {
        this.root._action(name, ...args)
    }

    ref (id: string, node?: HTMLElement | Renderable<any>): void {
        if (node) this.root.ids[id] = node
        else delete this.root.ids[id]
    }

    region (id: string, region: Region): void {
        this.root.regions[id] = region
    }

    delay (p: Promise<any>): void {
        this.busy.push(p)
    }

    end (): Promise<any> {
        const p = this.busy.slice(0)
        this.busy = []
        return Promise.all(p)
    }

    event (name: string): CustomEvent | undefined {
        const ce = this.root._options.customEvents
        return (ce && ce[name]) || customEvents[name]
    }

    computed (name: string): (any) => any | undefined {
        const c = this.root._options.computed
        return c && c[name]
    }

    abstract sub (data: {[name: string]: any}): DataContext
    abstract create (name: string, state?: object): Promise<Module | View>
    abstract helper (name: string): CustomHelper | undefined
    abstract component (name: string): Component | undefined
}

export class ViewDataContext extends AbstractDataContext {
    sub (data: {[name: string]: any}): DataContext {
        return new ViewDataContext(this.root, data, this.groups, this.busy)
    }

    create (name: string, state?: object): Promise<Module | View> {
        const p = (this.root as View)._module._createItem(name, state)
        this.delay(p)
        return p
    }

    helper (name: string): CustomHelper | undefined {
        const h = (this.root as View)._options.helpers
        return (h && h[name]) || helpers[name]
    }

    component (name: string): Component | undefined {
        const c = (this.root as View)._options.components
        return (c && c[name]) || components[name]
    }
}

export class ModuleDataContext extends AbstractDataContext {
    sub (data: {[name: string]: any}): DataContext {
        return new ModuleDataContext(this.root, data, this.groups, this.busy)
    }

    create (name: string, state?: object): Promise<Module | View> {
        const p = (this.root as Module)._createItem(name, state)
        this.delay(p)
        return p
    }

    helper (name: string): CustomHelper | undefined {
        return
    }

    component (name: string): Component | undefined {
        return
    }
}
