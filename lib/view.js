"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderable_1 = require("./renderable");
class View extends renderable_1.Renderable {
    constructor(mod, options) {
        super(mod.app, options, options.template && options.template.createLife(), ...mod.app.options.viewLifecycles);
        this._state = {};
        this._module = mod;
    }
    get regions() {
        return this._module.regions;
    }
    _init() {
        if (this._options.state)
            this.set(this._options.state, true);
        return super._init();
    }
    get(key) {
        if (!key)
            return this._state;
        if (this._options.computed && this._options.computed[key]) {
            return this._options.computed[key](this._state);
        }
        return this._state[key];
    }
    set(data, silent = false) {
        if (silent || this._status !== renderable_1.ComponentState.RENDERED) {
            Object.assign(this._state, data);
            return Promise.resolve();
        }
        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => Object.assign(this._state, data))
            .then(() => this._doCollect(this.get()))
            .then(d => this._doUpdated(d));
        return this._busy;
    }
    _dispatch(name, data) {
        return this._module._dispatch(name, data);
    }
}
exports.View = View;
