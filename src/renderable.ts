import { Lifecycle, LifecycleContainer } from './lifecycle'
import { Application } from './application'
import { Disposable } from './drizzle'
import { Node } from './template/node'
import { ModuleTemplate } from './template/module-template'
import { Appendable } from './template/template'

export interface RenderOptions extends Lifecycle {
    cycles?: Lifecycle[]
    customEvents?: {[name: string]: (HTMLElement, callback: (any) => void) => Disposable}
    events?: {[name: string]: (...args) => void}
    template?: ModuleTemplate,
    computed?: {[name: string]: (any) => any}
}

export enum ComponentState {
    CREATED, INITED, RENDERED
}

interface Region {
    show (name: string, state: object): Promise<Renderable<any>>
    _showNode (nodes: Node[], context: object): Promise<any>
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
        const c = this.get() as {[name: string]: any}
        if (this._options.computed) {
            c._computed = this._options.computed
        }
        return c
    }

    abstract get (name?: string): object
}
