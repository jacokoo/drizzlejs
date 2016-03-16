D.Base = function Base (name, options = {}, defaults) {
    this.options = options;
    this.id = D.uniqueId('D');
    this.name = name;
    this.Promise = new D.Promise(this);

    assign(this, defaults);
    if (options.mixin) this._mixin(options.mixin);
    this._loadedPromise = this._initialize();
};

D.assign(D.Base.prototype, {
    _initialize () {
    },

    _option (key, ...args) {
        const value = this.options[key];
        return D.isFunction(value) ? value.apply(this, args) : value;
    },

    _error (message, ...rest) {
        if (!D.isString(message)) throw message;
        throw new Error(`[${this.module ? this.module.name + ':' : ''}${this.name}] ${message} ${rest.join(' ')}`);
    },

    _mixin (obj) {
        mapObj(obj, (value, key) => {
            const old = this[key];
            if (!old) {
                this[key] = value;
                return;
            }

            if (D.isFunction(old)) {
                this[key] = (...args) => {
                    args.unshift(old);
                    return value.apply(this, args);
                };
            }
        });
    },

    chain (...args) {
        return this.Promise.chain(...args);
    }
});
