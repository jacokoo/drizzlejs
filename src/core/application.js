D.Application = class Application extends D.Base {
    constructor (options) {
        super(options && options.name || 'Application', assign({
            scriptRoot: 'app',
            urlRoot: '',
            urlSuffix: '',
            caseSensitiveHash: false,
            container: root && root.document.body,
            disabledClass: 'disabled',
            getResource: null,
            idKey: 'id',
            viewport: 'viewport'
        }, options), {
            global: {},
            _modules: {},
            _loaders: {}
        });
    }

    _initialize () {
        this._templateEngine = this._option('templateEngine') || new D.TemplateEngine();
        this.registerLoader('default', new D.Loader(this), true);
        this._region = this._createRegion(this._option('container'), 'Region');
    }

    registerLoader (name, loader, isDefault) {
        this._loaders[name] = loader;
        if (isDefault) this._defaultLoader = loader;
        return this;
    }

    start (defaultHash) {
        if (defaultHash) this._router = new D.Router(this);

        return this.chain(
            defaultHash ? this._router._mountRoutes(...this._option('routers')) : false,
            this._region.show(this._option('viewport')),
            (viewport) => this.viewport = viewport,
            () => defaultHash && this._router._start(defaultHash),
            this
        );
    }

    stop () {
        this.off();
        this._region.close();
        if (this._router) this._router._stop();
    }

    navigate (hash, trigger) {
        if (!this._router) return;
        this._router.navigate(hash, trigger);
    }

    dispatch (name, payload) {
        const n = D.isObject(name) ? name.name : name,
            p = D.isObject(name) ? name.payload : payload;
        this.trigger(`app.${n}`, p);
    }

    show (region, moduleName, options) {
        return this.viewport.regions[region].show(moduleName, options);
    }

    _getLoader (name, mod) {
        return name && this._loaders[name] || mod && mod._loader || this._defaultLoader;
    }

    _createModule (name, parentModule) {
        const { name: moduleName, loader: loaderName } = D.Loader._analyse(name),
            loader = this._getLoader(loaderName, parent);

        return this.chain(loader.loadModule(moduleName), (options = {}) => {
            return typeCache.createModule(options.type, moduleName, this, parentModule, loader, options);
        });
    }

    _createView (name, mod) {
        const { name: viewName, loader: loaderName } = D.Loader._analyse(name),
            loader = this._getLoader(loaderName, mod);

        return this.chain(loader.loadView(viewName, mod), (options = {}) => {
            return typeCache.createView(options.type, viewName, this, mod, loader, options);
        });
    }

    _createRegion (el, name, mod) {
        const { name: regionName, loader: type } = D.Loader._analyse(name);
        return typeCache.createRegion(type, this, mod, el, regionName);
    }

    _createStore (mod, options = {}) {
        return typeCache.createStore(options.type, mod, options);
    }

    _createModel (store, options = {}) {
        return typeCache.createModel(options.type, store, options);
    }
};

assign(D.Application.prototype, D.Event);
