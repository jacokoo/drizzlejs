import { RenderOptions, Renderable, ComponentState } from './renderable'
import { StoreOptions, Store } from './store'
import { Application } from './application'
import { Loader } from './loader'
import { View, ViewOptions } from './view'
import { Disposable, EmptyDisposable} from './drizzle'

export interface ItemOptions {
    view?: string
    module?: {
        path: string,
        loader?: {name: string, args?: string[]}
    }
}

interface ModuleOptions extends RenderOptions {
    store?: StoreOptions
    exportedModels?: string[]
    state?: object,

    items?: {[name: string]: ItemOptions}
}

const UPDATE_ACTION = `update${+new Date()}`

export class Module extends Renderable<ModuleOptions> {
    items: {[key: string]: {
        type: 'view' | 'module'
        options: ModuleOptions | ViewOptions
        loader: Loader
    }}

    private _store: Store
    private _handlers: {[name: string]: ((data: any) => void)[]} = {}
    private _loader: Loader

    constructor(app: Application, loader: Loader, options: ModuleOptions) {
        super(app, options)
        this._loader = loader
    }

    set (data: object) {
        const {exportedModels} = this._options
        if (!exportedModels || !exportedModels.length) return

        const d = exportedModels.reduce((acc, item) => {
            if (data[item]) acc[item] = data[item]
            return acc
        }, {})

        return (this._status === ComponentState.CREATED ? this._store : this).dispatch(UPDATE_ACTION, d)
    }

    get (name?: string) {
        return this._store.get(name)
    }

    dispatch (name: string, payload?: any) {
        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => this._store.dispatch(name, payload))
            .then(() => this._doUpdated())

        return this._busy
    }

    on (name: string, handler: (data: any) => void): Disposable {
        if (!this._handlers[name]) this._handlers[name] = []
        const hs = this._handlers[name]

        if (hs.indexOf(handler) !== -1) return EmptyDisposable
        hs.push(handler)

        return {
            dispose: () => {
                const idx = hs.indexOf(handler)
                if (idx !== -1) hs.splice(idx, 1)
            }
        }
    }

    fire (name: string, data: any) {
        if (!this._handlers[name]) return
        const hs = this._handlers[name].slice()
        hs.forEach(it => it.call(this, data))
    }

    createItem (name: string) {
        const opt = this.items[name]
        const item = opt.type === 'view' ? new View(this, opt.options) : new Module(this.app, opt.loader, opt.options)
        return item._init().then(() => item)
    }

    _render (el: HTMLElement, nextSibling?: HTMLElement) {
        const busy = super._render(el, nextSibling)

        if (busy === this._busy) {
            this._busy = this._busy.then(() => {
                const {store} = this._options
                if (store && store.actions && store.actions.init) {
                    return this.dispatch('init')
                }
            })
            return this._busy
        }

        return busy
    }

    _init () {
        this._store = new Store(this._options.store || {}, UPDATE_ACTION)
        this.set(this._options.state || {})
        return this._loadItems().then(() => super._init())
    }

    private _loadItems (): Promise<any> {
        const {items} = this._options
        const ks = Object.keys(items)
        const loaders = ks.map(k => {
            return items[k].view ? this._loader : this.app.createLoader(items[k].module.path, items[k].module.loader)
        })
        return Promise.all(ks.map((k, i) => loaders[i].load(items[k].view ? items[k].view : 'index')))
            .then(data => Promise.all(ks.map((k, i) => {
                this.items[k] = {
                    type: items[k].view ? 'view' : 'module',
                    options: data[i],
                    loader: loaders[i]
                }
            })))
    }
}