"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    constructor(options) {
        const opt = typeof options === 'function' ? { data: options } : options;
        this._options = opt;
        this.set(opt.data());
    }
    set(data) {
        let d = data;
        const { parser, root } = this._options;
        if (parser)
            d = parser(d);
        if (root && d)
            d = d[root];
        this._data = d;
    }
    get() {
        // clone it or make it readonly in dev mode
        return this._data;
    }
}
exports.Model = Model;
