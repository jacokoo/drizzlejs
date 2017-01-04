D.Base = class Base {

    constructor (parent, name) {
        this.id = D.uniqueId('D');
        this.name = name;
        this._parent = parent;
        this._options = {};

        this._initialize();
    }

    _initialize () {}

    _set (key, value) {
        this._options[key] = value;
    }

    _get (key, ...args) {
        const value = this._options[key];
        args.unshift(this);
        return isFunction(value) ? value.apply(null, args) : value;
    }

    _mixin (key, value) {
        const old = this[key];
        if (!old) {
            this[key] = value;
            return;
        }

        if (isFunction(old) && isFunction(value)) {
            this[key] = (...args) => {
                args.unshift(old);
                return value.apply(this, args);
            };
        }
    }
};
