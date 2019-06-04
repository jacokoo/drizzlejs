import { Lifecycle, LifecycleContainer } from './lifecycle'
import { Application } from './application'
import { Slot } from './template/slot-tag'
import { ElementContainer } from './template/context'
import { CustomEvent } from './template/common'

export interface RenderOptions extends Lifecycle {
    cycles?: Lifecycle[]
    customEvents?: {[name: string]: CustomEvent}
    events?: {[name: string]: (...args) => void}
    computed?: {[name: string]: (any) => any}
    actions?: {[name: string]: (cb: (data: any) => Promise<any>, data: object) => void}
    _file?: string
}

export enum ComponentState {
    CREATED, INITED, RENDERED
}

export abstract class Renderable<T extends RenderOptions> extends LifecycleContainer {
    _target: ElementContainer
    _options: T
    ids: {[key: string]: HTMLElement | Renderable<T>} = {}
    slots: {[key: string]: Slot}

    protected _busy: Promise<any> = Promise.resolve()
    protected _status = ComponentState.CREATED

    constructor(app: Application, options: T, ...args: Lifecycle[]) {
        super(app, options, ...args)
        this._options = options
    }

    _render (target: ElementContainer) {
        if (this._status !== ComponentState.INITED) return Promise.resolve()

        this._target = target
        this._busy = this._busy
            .then(() => this._doBeforeRender())
            .then(() => this._doCollect(this.get()))
            .then(data => this._doRendered(data))
            .then(() => this._status = ComponentState.RENDERED)

        return this._busy
    }

    destroy () {
        if (this._status !== ComponentState.RENDERED) return Promise.resolve()

        this._busy = this._busy
            .then(() => this._doBeforeDestroy())
            .then(() => this._doDestroyed())
            .then(() => this._status = ComponentState.INITED)

        return this._busy
    }

    _init () {
        return this._busy = this._busy
            .then(() => this._doInit())
            .then(() => this._status = ComponentState.INITED)
    }

    _event (name, ...args: any[]) {
        const {events} = this._options
        if (events && events[name]) events[name].apply(this, args)
    }

    _action (name: string, ...data: any[]) {
        const {actions} = this._options
        if (actions && actions[name]) {
            actions[name].call(this, (d: any) => {
                return this._dispatch(name, d)
            }, ...data)
            return
        }

        this._dispatch(name, data[0])
    }

    abstract get (name?: string): object
    abstract _dispatch (name: string, data: any): Promise<any>
}
