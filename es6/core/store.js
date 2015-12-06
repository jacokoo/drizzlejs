D.Store = class Store extends D.Base {
    constructor (app, mod, options) {
        super('Store', options, {
            app,
            module: mod,
            _models: {},
            _callbacks: this._option('callbacks')
        });

        app.delegateEvent(this);
    }

    get models () {return this._models;}

    dispatch (action) {

    }

    _initialize () {
        this._initializeModels();
    }

    _initializeModels () {
        mapObj(this._option('models'), (value, key) => {
            if (D.isFunction(value)) value = value.call(this) || {};
            this._models[key] = this.app._createModel(this.module, value);
        });
    }

    _beforeModuleRender () {
        return this.chain(mapObj(this._models, (model, key) => {
            return model.options.autoLoad === true ? D.Request.get(model) : null;
        }));
    }

    _afterModuleRender () {
        return this.chain(mapObj(this._models, (model, key) => {
            let {autoLoad} = model.options;
            return autoLoad && autoLoad !== true ? D.Request.get(model) : null;
        }));
    }

    _beforeModuleClose () {}

    _afterModuleClose () {}
};
