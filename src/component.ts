import { RenderOptions, Renderable, ComponentState } from './renderable'
import { StoreOptions, Store } from './store'
import { Application } from './application'
import { Loader } from './loader'
import { View, ViewOptions } from './view'
import { Events } from './event'
import { Disposable } from './drizzle'
import { ElementContainer } from './template/context'
import { ComponentTemplate } from './template/template'

export interface ItemOptions {
    views?: string[]
    refs?: string[]
    components?: {[name: string]: string}
}

export interface ComponentOptions extends RenderOptions {
    template?: ComponentTemplate
    store?: StoreOptions
    items?: ItemOptions
}

const UPDATE_ACTION = `update${+new Date()}`

const clone = (target: any) => {
    if (Array.isArray(target)) {
        return target.map(it => clone(it))
    }
    if (typeof target === 'object') {
        return Object.keys(target).reduce((acc: any, it) => {
            acc[it] = clone(target[it])
            return acc
        }, {})
    }
    return target
}

interface ComponentRenference {
    [name: string]: {
        loader: string,
        path: string
        args?: any
    }
}

export const componentReferences: ComponentRenference = {}

export class Component extends Renderable<ComponentOptions> implements Events {
    _items: {[key: string]: {
        type: 'view' | 'component'
        options: ComponentOptions | ViewOptions
        loader: Loader
    }} = {}
    _extraState: object
    _handlers = {}

    private _store: Store
    private _loader: Loader

    constructor(app: Application, loader: Loader, options: ComponentOptions, extraState: object = {}) {
        super(app, options, options.template && options.template.create(), ...app.options.componentLifecycles)
        this._loader = loader
        this._extraState = extraState
        this.slots = {}
    }

    set (data: object) {
        if (!this._options.template) return

        const {exportedModels} = this._options.template
        if (!exportedModels || !exportedModels.length) return

        const d = exportedModels.reduce((acc, item) => {
            if (data[item]) acc[item] = data[item]
            return acc
        }, {})

        return this._status === ComponentState.CREATED ?
            this._store.dispatch(UPDATE_ACTION, d) : this._dispatch(UPDATE_ACTION, d)
    }

    get (name?: string) {
        const obj = this._store.get(name)

        // TODO only works in dev mode
        return clone(obj)
    }

    _createItem (name: string, state?: object) {
        const opt = this._items[name]
        const item = opt.type === 'view' ?
            new View(this, opt.options) :
            new Component(this.app, opt.loader, opt.options as ComponentOptions, state)
        return item._init().then(() => item)
    }

    _dispatch (name: string, payload?: any) {
        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => this._store.dispatch(name, payload))
            .then(() => this._doCollect(this.get()))
            .then(data => this._doUpdated(data))

        return this._busy
    }

    _render (target: ElementContainer) {
        return super._render(target).then(() => {
            if (this._status === ComponentState.RENDERED) {
                const {store} = this._options
                if (store && store.actions && store.actions.init) {
                    return this._dispatch('init')
                }
            }
        })
    }

    _init () {
        this._store = new Store(this, this._options.store || {}, UPDATE_ACTION)
        this.set(Object.assign({}, this._extraState))
        const p = this._loadItems().then(() => super._init())
        return p
    }

    on (name: string, handler: (data: any) => void): Disposable {
        return null
    }

    fire (name: string, data: any) {
    }

    private _loadItems (): Promise<any> {
        const {items} = this._options
        if (!items) return Promise.resolve()

        let ps: {name: string, type: string, loader: Loader}[] = []

        if (items.views) {
            ps = ps.concat(items.views.map(it => {
                return {name: it, type: 'view', loader: this._loader}
            }))
        }

        if (items.refs) {
            ps = ps.concat(items.refs.map(it => {
                const obj = componentReferences[it]
                const loader = this.app.createLoader(obj.path, {name: obj.loader, args: obj.args})
                return {name: it, type: 'component', loader}
            }))
        }

        if (items.components) {
            ps = ps.concat(Object.keys(items.components).map(it => {
                const path = items.components[it]
                const loader = this.app.createLoader(path)
                return {name: it, type: 'component', loader}
            }))
        }

        return Promise.all(ps.map((k, i) => ps[i].loader.load(ps[i].type === 'view' ? ps[i].name : 'index', this)))
            .then(data => {
                ps.forEach((p, i) => {
                    this._items[p.name] = {type: p.type as ('view' | 'component'), loader: p.loader, options: data[i]}
                })
            })
    }
}

Object.getOwnPropertyNames(Events.prototype).forEach(it => {
    Component.prototype[it] = Events.prototype[it]
})
