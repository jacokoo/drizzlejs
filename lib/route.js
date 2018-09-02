"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("./module");
// /name
class Token {
    constructor(key, next) {
        this.v = 9;
        this.key = key;
        this.next = next;
    }
    match(keys) {
        const c = keys[0];
        if (!c)
            return false;
        return this.doMatch(c, keys.slice(1));
    }
    value(v = 0) {
        const vv = v + this.v;
        return this.next ? this.next.value(vv * 10) : vv;
    }
    doMatch(key, keys) {
        if (key !== this.key)
            return false;
        if (this.next)
            return this.next.match(keys);
        return { remain: keys };
    }
}
// /:name
class ArgToken extends Token {
    constructor() {
        super(...arguments);
        this.v = 8;
    }
    doMatch(key, keys) {
        const oo = { [this.key]: key };
        if (!this.next)
            return { remain: keys, args: oo };
        const o = this.next.match(keys);
        if (o === false)
            return false;
        o.args ? Object.assign(o.args, oo) : (o.args = oo);
        return o;
    }
}
// /*name
class AllToken extends Token {
    constructor() {
        super(...arguments);
        this.v = 7;
    }
    match(keys) {
        if (!keys.length)
            return false;
        return { args: { [this.key]: keys }, remain: [] };
    }
}
const create = (path) => {
    const ts = path.trim().split('/').filter(it => !!it);
    return ts.reduceRight((acc, item) => {
        if (item.charAt(0) === '*')
            return new AllToken(item.slice(1), acc);
        if (item.charAt(0) === ':')
            return new ArgToken(item.slice(1), acc);
        return new Token(item, acc);
    }, null);
};
class Router {
    constructor(module, routes) {
        this._keys = [];
        this._defs = [];
        this._currentKey = -1;
        this._module = module;
        this.initRoutes(routes);
    }
    route(keys) {
        for (let i = 0; i < this._keys.length; i++) {
            const re = this._keys[i].match(keys);
            if (re)
                return this.doRoute(i, re);
        }
        return Promise.resolve(false);
    }
    leave() {
        return Promise.resolve().then(() => {
            if (this._next)
                return this._next.leave();
        }).then(() => {
            const h = this._defs[this._currentKey];
            if (h && h.leave)
                return h.leave();
        });
    }
    enter(idx, args, keys) {
        this._currentKey = idx;
        return this._defs[idx].enter(args).then(it => {
            this._next = it;
            if (it && keys.length)
                return it.route(keys);
        });
    }
    doRoute(idx, result) {
        const h = this._defs[idx];
        if (this._currentKey === -1) {
            return this.enter(idx, result.args, result.remain);
        }
        if (idx === this._currentKey) {
            return Promise.resolve().then(() => {
                if (h.update)
                    return h.update(result.args);
            }).then(() => {
                if (this._next)
                    return this._next.route(result.remain);
            });
        }
        return this.leave().then(() => {
            return this.enter(idx, result.args, result.remain);
        });
    }
    initRoutes(routes) {
        Object.keys(routes).map(key => {
            return { key, token: create(key) };
        }).sort((a, b) => b.token.value() - a.token.value()).forEach(it => {
            this._keys.push(it.token);
            this._defs.push(this.createHandler(routes[it.key]));
        });
    }
    createHandler(h) {
        if (typeof h === 'string')
            return this.createModuleHandler({ ref: h });
        if ('enter' in h)
            return h;
        if ('action' in h)
            return this.createActionHandler(h);
        if ('ref' in h)
            return this.createModuleHandler(h);
        throw new Error('unsupported router handler');
    }
    createActionHandler(h) {
        return {
            enter: (args) => {
                return this._module._dispatch(h.action, args).then(() => null);
            },
            update: (args) => {
                return this._module._dispatch(h.action, args);
            }
        };
    }
    createModuleHandler(h) {
        let item;
        return {
            enter: (args) => {
                const o = h.model ? { [h.model]: args } : args;
                return this._module.regions[h.region || 'default'].show(h.ref, o).then(it => {
                    item = it;
                    if (it instanceof module_1.Module)
                        return it._router;
                    return null;
                });
            },
            update: (args) => {
                const o = h.model ? { [h.model]: args } : args;
                if (item && (item instanceof module_1.Module))
                    return item.set(o);
                return Promise.resolve();
            }
        };
    }
}
exports.Router = Router;
