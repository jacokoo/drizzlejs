import { Loader } from './loader'
import { Component, ComponentOptions } from './component'
import { DrizzlePlugin } from './drizzle'
import { Lifecycle } from './lifecycle'
import { Events } from './event'
import { ElementParent } from './template/template'
import { CustomTransformer, CustomEvent, State, Widget } from './template/common'

export interface ApplicationOptions {
    stages?: string[]
    scriptRoot?: string
    container: HTMLElement
    entry: string | ComponentOptions
    customEvents?: {[name: string]: CustomEvent}
    transformers?: {[name: string]: CustomTransformer}
    widgets?: {[name: string]: Widget}
    componentLifecycles?: Lifecycle[]
    viewLifecycles?: Lifecycle[]
    getResource? (path): Promise<object>
}

interface LoaderConstructor {
    new (app: Application, path: string, args?: any): Loader
}

const customEvents: {[name: string]: CustomEvent} = {
    enter: {
        on (state: State, node: Element, cb: (any) => void) {
            const ee = function (this: Element, e) {
                if (e.keyCode !== 13) return
                e.preventDefault()
                cb.call(this, e)
            }
            state.set('enter', ee)
            node.addEventListener('keypress', ee, false)
        },
        off (state: State, node: Element, cb: (any) => void) {
            const ee = state.get('enter')
            if (!ee) return
            node.removeEventListener('keypress', ee, false)
            state.clear('enter')
        }
    }
}

export class Application extends Events {
    options: ApplicationOptions
    loaders: {[name: string]: LoaderConstructor} = {}
    private _plugins: DrizzlePlugin[] = []

    constructor(options: ApplicationOptions) {
        super()
        this.options = Object.assign({
            stages: ['init', 'template', 'default'],
            scriptRoot: 'app',
            entry: 'viewport',
            helpers: {},
            components: {},
            componentLifecycles: [],
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
        this.options.componentLifecycles = this.options.componentLifecycles.concat(plugin.componentLifecycles)
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
            const v = new Component(this, lo, options)
            return v._init().then(() => v._render(new ElementParent(container))).then(() => v)
        }
        if (typeof entry === 'string') {
            loader = this.createLoader(entry)
        } else {
            return create(this.createLoader(null), entry)
        }

        return loader.load('index', null).then(opt => create(loader, opt))
    }
}
