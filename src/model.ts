export interface ModelOptions {
    url?: string
    root?: string
    data: () => any
    parser?: (data: any) => any
}

export class Model {
    private _options: ModelOptions
    private _data: any

    constructor(options: ModelOptions) {
        this._options = options
        this.set(options.data())
    }

    set (data: any) {
        let d = data
        const {parser, root} = this._options
        if (parser) d = parser(d)
        if (root && d) d = d[root]

        this._data = d
    }

    get () {
        // clone it or make it readonly in dev mode
        return this._data
    }
}
