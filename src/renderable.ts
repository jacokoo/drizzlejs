import { Lifecycle, LifecycleContainer } from './lifecycle'
import { Application } from './application'
import { Disposable } from './drizzle'
import { Node } from './template/node'
import { Appendable, ModuleTemplate } from './template/template'

export interface RenderOptions extends Lifecycle {
    cycles?: Lifecycle[]
    state?: object,
    customEvents?: {[name: string]: (HTMLElement, callback: (any) => void) => Disposable}
    events?: {[name: string]: (...args) => void}
    template?: ModuleTemplate
    computed?: {[name: string]: (any) => any}
    actions?: {[name: string]: (cb: (data: any) => Promise<any>, data: object) => void}
}

export enum ComponentState {
    CREATED, INITED, RENDERED
}

export interface Region {
    item: Renderable<any>
    show (name: string, state: object): Promise<Renderable<any>>
    _showNode (nodes: Node[], context: object): Promise<any>
    _showChildren ()
    close (): Promise<any>
}

export abstract class Renderable<T extends RenderOptions> extends LifecycleContainer {
    _target: Appendable
    _options: T
    ids: {[key: string]: HTMLElement | Renderable<T>} = {}
    regions: {[key: string]: Region}

    protected _busy: Promise<any> = Promise.resolve()
    protected _status = ComponentState.CREATED

    constructor(app: Application, options: T, ...args: Lifecycle[]) {
        super(app, options, ...args)
        this._options = options
    }

    _render (target: Appendable) {
        if (this._status !== ComponentState.INITED) return Promise.resolve()

        this._target = target
        this._busy = this._busy
            .then(() => this._doBeforeRender())
            .then(() => this._doRendered())
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

    _context () {
        const c = Object.assign({}, this.get() as {[name: string]: any})
        if (this._options.computed) {
            c._computed = this._options.computed
        }
        return c
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
