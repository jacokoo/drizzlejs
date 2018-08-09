import { Application } from './application'
import { Module } from './module'

export class Loader {
    protected _app: Application
    protected _path: string
    protected _args: any

    constructor(app: Application, path: string, args: any) {
        this._app = app
        this._path = path
        this._args = args
    }

    load (file, mod: Module): Promise<object> {
        return this._app.options.getResource(`${this._app.options.scriptRoot}/${this._path}/${file}`)
    }
}
