import { RenderOptions, Renderable, ComponentState } from './renderable'
import { Module } from './module'
import { DynamicNode } from './template/dynamic-node'

export interface ViewOptions extends RenderOptions {
    helpers?: {[name: string]: (...any) => any}
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
        super(mod.app, options, options.template && options.template.life)
        this._module = mod
    }

    get regions () {
        return this._module.regions
    }

    get (key?: string) {
        if (!key) return this._state

        if (this._options.computed && this._options.computed[key]) {
            return this._options.computed[key](this._state)
        }

        return this._state[key]
    }

    set (data: object, silent: boolean = false) {
        if (silent || this._status !== ComponentState.RENDERED) {
            Object.assign(this._state, data)
            return Promise.resolve()
        }

        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => Object.assign(this._state, data))
            .then(() => this._doUpdated())

        return this._busy
    }

    _dispatch (name: string, data: any) {
        return this._module._dispatch(name, data)
    }
}
