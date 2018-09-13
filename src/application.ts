import { Loader } from './loader'
import { Module, ModuleOptions } from './module'
import { createAppendable } from './template/util'
import { CustomEvent, CustomHelper, Component } from './template/context'
import { Disposable, DrizzlePlugin } from './drizzle'
import { Lifecycle } from './lifecycle'

export interface ApplicationOptions {
    stages?: string[]
    scriptRoot?: string
    container: HTMLElement
    entry: string | ModuleOptions
    customEvents?: {[name: string]: CustomEvent}
    helpers?: {[name: string]: CustomHelper}
    components?: {[name: string]: Component}
    moduleLifecycles?: Lifecycle[]
    viewLifecycles?: Lifecycle[]
    getResource? (path): Promise<object>
}

interface LoaderConstructor {
    new (app: Application, path: string, args?: any): Loader
}

const customEvents: {[name: string]: CustomEvent} = {
    enter (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 13) return
            e.preventDefault()
            cb.call(this, e)
        }
        node.addEventListener('keypress', ee, false)
        return {
            dispose () {
                node.removeEventListener('keypress', ee, false)
            }
        }
    },

    escape (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 27) return
            cb.call(this, e)
        }
        node.addEventListener('keyup', ee, false)
        return {
            dispose () {
                node.removeEventListener('keyup', ee, false)
            }
        }
    }
}

export class Application {
    options: ApplicationOptions
    loaders: {[name: string]: LoaderConstructor} = {}
    private _plugins: DrizzlePlugin[] = []

    constructor(options: ApplicationOptions) {
        this.options = Object.assign({
            stages: ['init', 'template', 'default'],
            scriptRoot: 'app',
            entry: 'viewport',
            helpers: {},
            components: {},
            moduleLifecycles: [],
            viewLifecycles: []
        }, options)

        this.options.customEvents = Object.assign(customEvents, this.options.customEvents)
        this.registerLoader(Loader)
    }

    registerLoader (loader: LoaderConstructor, name: string = 'default') {
        this.loaders[name] = loader
    }

    createLoader (path: string, loader?: {name: string, args?: any}): Loader {
        if (loader) {
            return new this.loaders[loader.name](this, path, loader.args)
        }
        return new this.loaders.default(this, path)
    }

    use (plugin: DrizzlePlugin) {
        plugin.init(this)
        this.options.moduleLifecycles = this.options.moduleLifecycles.concat(plugin.moduleLifecycles)
        this.options.viewLifecycles = this.options.viewLifecycles.concat(plugin.viewLifecycles)
        this._plugins.push(plugin)
    }

    start (): Promise<any> {
        return this.startViewport().then(item => {
            this._plugins.forEach(it => it.started(item))
        })
    }

    private startViewport () {
        let loader: Loader

        const {entry, container} = this.options
        const create = (lo, options) => {
            const v = new Module(this, lo, options)
            return v._init().then(() => v._render(createAppendable(container))).then(() => v)
        }
        if (typeof entry === 'string') {
            loader = this.createLoader(entry)
        } else {
            return create(this.createLoader(null), entry)
        }

        return loader.load('index', null).then(opt => create(loader, opt))
    }
}
