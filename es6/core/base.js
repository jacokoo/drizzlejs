D.Base = class Base {
    constructor (name, options = {}, defaults) {
        this.options = options;
        this.id = D.uniqueId('D');
        this.name = name;
        this.Promise = new D.Promise(this);

        Object.assign(this, defaults);
        if (options.mixin) this._mixin(options.mixin);
        this.initialize();
    }

    initialize () {
    }

    _option (key, ...args) {
        let value = this.options[key];
        return D.isFunction(value) ? value.apply(this, args) : value;
    }

    _error (message, ...rest) {
        if (!D.isString(message)) throw message;
        throw new Error(`[${this.module ? this.module.name + ':' : ''}${this.name}] ${message} ${rest.join(' ')}`)
    }

    _mixin (obj) {
        mapObj(obj, (value, key) => {
            let old = this[key];
            if (!old) return this[key] = value;

            if (D.isFunction(old)) {
                this[key] = () => {
                    let args = slice.call(arguments);
                    args.unshift(old);
                    return value.apply(this, args);
                }
            }
        });
    }

    chain (...args) {
        return this.Promise.chain(...args);
    }
};
