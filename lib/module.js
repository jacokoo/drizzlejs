"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderable_1 = require("./renderable");
const store_1 = require("./store");
const view_1 = require("./view");
const route_1 = require("./route");
const UPDATE_ACTION = `update${+new Date()}`;
const clone = (target) => {
    if (Array.isArray(target)) {
        return target.map(it => clone(it));
    }
    if (typeof target === 'object') {
        return Object.keys(target).reduce((acc, it) => {
            acc[it] = clone(target[it]);
            return acc;
        }, {});
    }
    return target;
};
exports.moduleReferences = {};
class Module extends renderable_1.Renderable {
    constructor(app, loader, options, extraState = {}) {
        super(app, options, options.template && options.template.createLife());
        this._items = {};
        this._handlers = {};
        this._loader = loader;
        this._extraState = extraState;
        this.regions = {};
        if (options.routes)
            this._router = new route_1.Router(this, options.routes);
    }
    set(data) {
        if (!this._options.template)
            return;
        const { exportedModels } = this._options.template;
        if (!exportedModels || !exportedModels.length)
            return;
        const d = exportedModels.reduce((acc, item) => {
            if (data[item])
                acc[item] = data[item];
            return acc;
        }, {});
        return this._status === renderable_1.ComponentState.CREATED ?
            this._store.dispatch(UPDATE_ACTION, d) : this._dispatch(UPDATE_ACTION, d);
    }
    get(name) {
        const obj = this._store.get(name);
        // TODO only works in dev mode
        return clone(obj);
    }
    on(name, handler) {
        if (!this._handlers[name])
            this._handlers[name] = [];
        const hs = this._handlers[name];
        if (hs.indexOf(handler) !== -1)
            return { dispose: () => { } };
        hs.push(handler);
        return {
            dispose: () => {
                const idx = hs.indexOf(handler);
                if (idx !== -1)
                    hs.splice(idx, 1);
            }
        };
    }
    fire(name, data) {
        if (!this._handlers[name])
            return;
        const hs = this._handlers[name].slice();
        hs.forEach(it => it.call(this, data));
    }
    _createItem(name, state) {
        const opt = this._items[name];
        const item = opt.type === 'view' ?
            new view_1.View(this, opt.options) :
            new Module(this.app, opt.loader, opt.options, state);
        return item._init().then(() => item);
    }
    _dispatch(name, payload) {
        this._busy = this._busy
            .then(() => this._doBeforeUpdate())
            .then(() => this._store.dispatch(name, payload))
            .then(() => this._doUpdated());
        return this._busy;
    }
    _render(target) {
        const busy = super._render(target);
        if (busy === this._busy) {
            this._busy = this._busy.then(() => {
                const { store } = this._options;
                if (store && store.actions && store.actions.init) {
                    return this._dispatch('init');
                }
            });
            return this._busy;
        }
        return busy;
    }
    _init() {
        this._store = new store_1.Store(this, this._options.store || {}, UPDATE_ACTION);
        this.set(Object.assign({}, this._options.state, this._extraState));
        return this._loadItems().then(() => super._init());
    }
    _loadItems() {
        const { items } = this._options;
        if (!items)
            return Promise.resolve();
        let ps = [];
        if (items.views) {
            ps = ps.concat(items.views.map(it => {
                return { name: it, type: 'view', loader: this._loader };
            }));
        }
        if (items.refs) {
            ps = ps.concat(items.refs.map(it => {
                const obj = exports.moduleReferences[it];
                const loader = this.app.createLoader(obj.path, { name: obj.loader, args: obj.args });
                return { name: it, type: 'module', loader };
            }));
        }
        if (items.modules) {
            ps = ps.concat(Object.keys(items.modules).map(it => {
                const path = items.modules[it];
                const loader = this.app.createLoader(path);
                return { name: it, type: 'module', loader };
            }));
        }
        return Promise.all(ps.map((k, i) => ps[i].loader.load(ps[i].type === 'view' ? ps[i].name : 'index', this)))
            .then(data => {
            ps.forEach((p, i) => {
                this._items[p.name] = { type: p.type, loader: p.loader, options: data[i] };
            });
        });
    }
}
exports.Module = Module;
