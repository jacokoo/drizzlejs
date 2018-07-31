import { Lifecycle, LifecycleContainer } from './lifecycle'
import { Application } from './application'
import { Disposable } from './drizzle'
import { Node } from './template/node'
import { ModuleTemplate } from './template/module-template'

export interface RenderOptions extends Lifecycle {
    cycles?: Lifecycle[]
    customEvents?: {[name: string]: (HTMLElement, callback: (any) => void) => Disposable}
    events?: {[name: string]: (...args) => void}
    template?: ModuleTemplate
}

export enum ComponentState {
    CREATED, INITED, RENDERED
}

interface Region {
    show (item: Renderable<any>): Promise<any>
    _showNode (nodes: Node[], context: object): Promise<any>
    close (): Promise<any>
}

export class Renderable<T extends RenderOptions> extends LifecycleContainer {
    _element: HTMLElement
    _nextSibling: HTMLElement
    _options: T
    ids: {[key: string]: HTMLElement | Renderable<T>} = {}
    regions: {[key: string]: Region}

    protected _busy: Promise<any> = Promise.resolve()
    protected _status = ComponentState.CREATED

    constructor(app: Application, options: T, ...args: Lifecycle[]) {
        super(app, options, ...args)
        this._options = options
    }

    _render (el: HTMLElement, nextSibling?: HTMLElement) {
        if (this._status !== ComponentState.INITED) return Promise.resolve()
        this._status = ComponentState.RENDERED

        this._element = el
        this._nextSibling = nextSibling
        this._busy = this._busy
            .then(() => this._doBeforeRender())
            .then(() => this._doRendered())

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

}
