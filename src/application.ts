import { Loader } from './loader'
import { Disposable } from './drizzle'
import { Module } from './module'

interface ApplicationOptions {
    stages?: string[],
    scriptRoot?: string
    container: HTMLElement,
    entry: string | {path: string, loader?: {name: string, args?: string[]}},
    customEvents?: {[name: string]: (HTMLElement, callback: (any) => void) => Disposable}
    getResource? (path): Promise<object>
}

export class Application {
    options: ApplicationOptions

    constructor(options: ApplicationOptions) {
        this.options = Object.assign({
            stages: ['init', 'template', 'default'],
            scriptRoot: 'app',
            entry: 'viewport'
        }, options)
    }

    createLoader (path: string, loader?: {name: string, args?: any}): Loader {
        return new Loader(this, path, null) // TODO
    }

    start (): Promise<any> {
        let loader: Loader
        const {entry, container} = this.options
        if (typeof entry === 'string') {
            loader = this.createLoader(entry)
        } else {
            loader = this.createLoader(entry.path, entry.loader)
        }

        return loader.load('index').then(opt => {
            const v = new Module(this, loader, opt)
            return v._init().then(() => v._render(container))
        })
    }
}
