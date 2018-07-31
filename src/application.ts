import { Loader } from './loader'
import { Disposable } from './drizzle'

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

    createLoader (path: string, loader?: {name: string, args?: string[]}): Loader {
        return new Loader(this, path, [])
    }
}
