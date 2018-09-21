export interface ModelOptions {
    data: Supplier
}

type Supplier = () => any

export class Model {
    protected _options: ModelOptions
    protected _data: any

    constructor(options: ModelOptions | Supplier) {
        const opt = typeof options === 'function' ? { data: options } : options
        this._options = opt
        this.set(opt.data())
    }

    set (data: any) {
        this._data = data
    }

    get () {
        // clone it or make it readonly in dev mode
        return this._data
    }
}
