import { Loader } from './loader'
import { Disposable } from './drizzle'
import { Module, ModuleOptions } from './module'
import { createAppendable } from './template/util'

interface ApplicationOptions {
    stages?: string[],
    scriptRoot?: string
    container: HTMLElement,
    entry: string | ModuleOptions
    customEvents?: {[name: string]: (HTMLElement, callback: (any) => void) => Disposable},
    getResource? (path): Promise<object>
}

interface LoaderConstructor {
    new (app: Application, path: string, args?: any): Loader
}

export class Application {
    options: ApplicationOptions
    loaders: {[name: string]: LoaderConstructor} = {}

    constructor(options: ApplicationOptions) {
        this.options = Object.assign({
            stages: ['init', 'template', 'default'],
            scriptRoot: 'app',
            entry: 'viewport'
        }, options)

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

    start (): Promise<any> {
        return this.startViewport().then(item => {
            console.log(item)
            this.startRouter(item)
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

    private startRouter (item: Module) {
        if (!item._router) return
        const doIt = () => {
            const hash = window.location.hash
            if (hash.slice(0, 2) !== '#/') return
            const hs = hash.slice(2).split('/').filter(it => !!it)
            if (!hs.length) return
            item._router.route(hs).then(it => {
                console.log(it)
            })
        }

        window.addEventListener('popstate', doIt)
        doIt()
    }
}
