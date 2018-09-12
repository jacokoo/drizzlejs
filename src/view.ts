import { RenderOptions, Renderable, ComponentState } from './renderable'
import { Module } from './module'
import { Component } from './template/context'

export interface ViewOptions extends RenderOptions {
    helpers?: {[name: string]: (...any) => any},
    state?: object,
    components?: {[name: string]: Component}
}

export class View extends Renderable<ViewOptions> {
    _module: Module
    _state: object = {}

    constructor(mod: Module, options: ViewOptions) {
        super(mod.app, options, options.template && options.template.createLife())
        this._module = mod
    }

    get regions () {
        return this._module.regions
    }

    _init () {
        if (this._options.state) this.set(this._options.state, true)
        return super._init()
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
            .then(() => this._doCollect(this.get()))
            .then(d => this._doUpdated(d))

        return this._busy
    }

    _dispatch (name: string, data: any) {
        return this._module._dispatch(name, data)
    }
}
