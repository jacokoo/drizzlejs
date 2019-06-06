import { RenderOptions, Renderable, ComponentState } from './renderable'
import { Component } from './component'
import { CustomTransformer, Widget } from './template/common'
import { ViewTemplate } from './template/template'

export interface ViewOptions extends RenderOptions {
    template?: ViewTemplate
    transformers?: {[name: string]: CustomTransformer},
    state?: object,
    widgets?: {[name: string]: Widget}
}

export class View extends Renderable<ViewOptions> {
    _component: Component
    _state: object = {}

    constructor(mod: Component, options: ViewOptions) {
        super(mod.app, options, options.template && options.template.create(), ...mod.app.options.viewLifecycles)
        this._component = mod
    }

    get slots () {
        return this._component.slots
    }

    _init () {
        if (this._options.state) this._set(this._options.state, true)
        return super._init()
    }

    get (key?: string) {
        if (!key) return this._state

        if (this._options.computed && this._options.computed[key]) {
            return this._options.computed[key](this._state)
        }

        return this._state[key]
    }

    set (data: object) {
        return this._set(data, false)
    }

    _set (data: object, silent: boolean, source?: any) {
        if (silent || this._status !== ComponentState.RENDERED) {
            Object.assign(this._state, data)
            return Promise.resolve()
        }

        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => Object.assign(this._state, data))
            .then(() => this._doCollect(this.get()))
            .then(d => this._doUpdated(d, source))

        return this._busy
    }

    _dispatch (name: string, data: any) {
        return this._component._dispatch(name, data)
    }
}
