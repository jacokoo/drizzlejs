import { Loader } from './loader'
import { Disposable } from './drizzle'
import { Module, ModuleOptions } from './module'

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
        let loader: Loader
        const {entry, container} = this.options

        const create = (lo, options) => {
            const v = new Module(this, lo, options)
            return v._init().then(() => v._render(container))
        }
        if (typeof entry === 'string') {
            loader = this.createLoader(entry)
        } else {
            return create(this.createLoader(null), entry)
        }

        return loader.load('index', null).then(opt => create(loader, opt))
    }
}
