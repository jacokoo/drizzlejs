D.Base = class Base {

    constructor (parent, name, loader, defs = {}, opts = {}) {
        this.id = D.uniqueId('D');
        this.name = name;

        this._parent = parent;
        this._loader = loader;
        this._defs = defs;
        this._opts = opts;

        this._initialize();
        mapObj(this._def('mixin'), (value, key) => this._mixin(key, value));
    }

    _initialize () {}

    _def (key, ...args) {
        const value = this._defs[key];
        return isFunction(value) ? value.apply(this, args) : value;
    }

    _option (key, ...args) {
        const value = this._opts[key];
        return isFunction(value) ? value.apply(this, args) : value;
    }

    _mixin (key, value) {
        const old = this[key];
        if (!old) {
            this[key] = value;
            return;
        }

        if (isFunction(old) && isFunction(value)) {
            this[key] = (...args) => value.apply(this, [old].concat(args));
        }
    }
};
