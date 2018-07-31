import { RenderOptions, Renderable } from './renderable'
import { Module } from './module'
import { DynamicNode } from './template/dynamic-node'

export interface ViewOptions extends RenderOptions {
    actions?: {[name: string]: (cb: (data: any) => Promise<any>, data: object) => void}
}

export interface BindingGroup {
    type: 'checkbox' | 'radio'
    busy: boolean
    items: DynamicNode[]
}

export class View extends Renderable<ViewOptions> {
    _module: Module
    _groups: {[name: string]: BindingGroup} = {}
    _state: object = {}

    constructor(mod: Module, options: ViewOptions) {
        super(mod.app, options)
        this._module = mod
    }

    set (data: object, silent: boolean = false) {
        if (silent) {
            Object.assign(this._state, data)
            return Promise.resolve()
        }

        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => Object.assign(this._state, data))
            .then(() => this._doUpdated())

        return this._busy
    }

    _action (name: string, ...data: any[]) {
        const {actions} = this._options
        if (actions && actions[name]) {
            actions[name].call(this, (d: any) => {
                return this._module.dispatch(name, d)
            }, ...data)
            return
        }

        this._module.dispatch(name, data[0])
    }
}
