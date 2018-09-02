"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
class Store {
    constructor(mod, options, updateKey) {
        this._models = {};
        this._names = [];
        this._options = options;
        this._module = mod;
        const { models } = options;
        if (models) {
            this._names = Object.keys(models);
            this._names.forEach(k => this._models[k] = new model_1.Model(models[k]));
        }
        if (!options.actions)
            options.actions = {};
        options.actions[updateKey] = data => {
            this.set(data);
        };
    }
    fire(name, data) {
        this._module.fire(name, data);
    }
    get models() {
        return this._models;
    }
    get(name) {
        if (name)
            return this._models[name].get();
        return this._names.reduce((acc, item) => {
            acc[item] = this._models[item].get();
            return acc;
        }, {});
    }
    set(data) {
        this._names.forEach(k => (k in data) && this._models[k].set(data[k]));
    }
    dispatch(name, payload) {
        const { actions } = this._options;
        if (!actions || !actions[name])
            return Promise.reject();
        return Promise.resolve(actions[name].call(this, payload));
    }
}
exports.Store = Store;
