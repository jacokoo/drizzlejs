D.Store = class Store extends D.Base {
    constructor (mod, options) {
        super('Store', options, {
            app: mod.app,
            module: mod,
            _models: {}
        });
        
        this.app.delegateEvent(this);

        this._callbacks = this._option('callbacks');
        mapObj(this._callbacks, (value, key) => {
            if (key.slice(0, 4) !== 'app.') return;
            this.listenTo(this.app, key, (payload) => value.call(this._callbackContext, payload));
        });
    }

    get models () {return this._models;}

    dispatch (name, payload) {
        let callback, n = name, p = payload;
        if (D.isObject(n)) {
            p = n.payload;
            n = n.name;
        }

        callback = this._callbacks[n];
        if (!callback) this._error(`No action callback for name: ${name}`);
        return this.chain(callback.call(this._callbackContext, p));
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
            const v = (D.isFunction(value) ? value.call(this) : value) || {};
            if (v.shared === true) {
                this._models[key] = this.app.viewport.store[key];
                return;
            }
            this._models[key] = this.app._createModel(this, v);
        });
    }

    _loadEagerModels () {
        return this.chain(mapObj(this._models, (model) => {
            return model.options.autoLoad === true ? D.Request.get(model) : null;
        }));
    }

    _loadLazyModels () {
        return this.chain(mapObj(this._models, (model) => {
            const { autoLoad } = model.options;
            return autoLoad && autoLoad !== true ? D.Request.get(model) : null;
        }));
    }

    _destory () {
        this.stopListening();
    }
};
