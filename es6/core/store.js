D.Store = class Store extends D.Base {
    constructor (mod, options) {
        super('Store', options, {
            app: mod.app,
            module: mod,
            _models: {},
            _callbacks: this._option('callbacks')
        });

        app.delegateEvent(this);
    }

    get models () {return this._models;}

    dispatch (name, payload) {
        let callback;
        if (D.isObject(name)) {
            payload = name.payload;
            name = name.name;
        }

        callback = this._callbacks[name];
        if (!callback) this.error(`No action callback for name: ${name}`);
        return this.chain(callback.call(this._callbackContext, payload));
    }

    _initialize () {
        this._initializeModels();
        this._callbackContext = Object.assign({
            models: this.models,
            module: this.module,
            app: this.app
        }, D.Request);
    }

    _initializeModels () {
        mapObj(this._option('models'), (value, key) => {
            if (D.isFunction(value)) value = value.call(this) || {};
            this._models[key] = this.app._createModel(this, value);
        });
    }

    _loadEagerModels () {
        return this.chain(mapObj(this._models, (model, key) => {
            return model.options.autoLoad === true ? D.Request.get(model) : null;
        }));
    }

    _loadLazyModels () {
        return this.chain(mapObj(this._models, (model, key) => {
            let {autoLoad} = model.options;
            return autoLoad && autoLoad !== true ? D.Request.get(model) : null;
        }));
    }

    _destory () {
        this.stopListening();
    }
};
