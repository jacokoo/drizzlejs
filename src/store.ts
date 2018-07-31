import { ModelOptions, Model } from './model'

export interface StoreOptions {
    models?: {[key: string]: ModelOptions}
    actions?: {[key: string]: (payload: any) => void}
}

export class Store {
    private _options: StoreOptions
    private _models: {[key: string]: Model} = {}
    private _names: string[] = []

    constructor(options: StoreOptions, updateKey: string) {
        this._options = options
        const {models} = options
        if (models) {
            this._names = Object.keys(models)
            this._names.forEach(k => this._models[k] = new Model(models[k]))
        }

        if (!options.actions) options.actions = {}
        options.actions[updateKey] = data => {
            this.set(data)
        }
    }

    get models () {
        return this._models
    }

    get (name?: string) {
        if (name) return this._models[name].get()

        return this._names.reduce((acc: {[key: string]: any}, item) => {
            acc[item] = this._models[item].get()
            return acc
        }, {})
    }

    set (data: object) {
        this._names.forEach(k => data[k] && this._models[k].set(data[k]))
    }

    dispatch (name: string, payload: any): Promise<void> {
        const {actions} = this._options
        if (!actions || !actions[name]) return Promise.reject()
        return Promise.resolve(actions[name].call(this, payload))
    }
}
