D.Application = class Application extends D.Base {
    constructor (options) {
        super(options && options.name || 'Application', Object.assign({
            scriptRoot: 'app',
            urlRoot: '',
            urlSuffix: '',
            caseSensitiveHash: false,
            defaultRegion: root.document.body,
            disabledClass: 'disabled',
            attributesReferToId: ['for', 'data-target', 'data-parent'],
            getResource: null,
            idKey: 'id',
            viewport: 'viewport',

            fileNames: {
                module: 'index',
                view: 'view-',
                router: 'router'
            },

            pagination: {
                pageSize: 10,
                pageKey: '_page',
                pageSizeKey: '_pageSize',
                recordCountKey: 'recordCount'
            }
        }, options), {
            global: {},
            _modules: {},
            _loaders: {}
        });
    }

    _initialize () {
        this._templateEngine = this._option('templateEngine');
        this.registerLoader('default', new D.Loader(), true);
        this._region = this._createRegion(this._option('defaultRegion'), 'Region');
    }

    registerLoader (name, loader, isDefault) {
        this.loaders[name] = loader;
        if (isDefault) this._defaultLoader = loader;
        return this;
    }

    start (defaultRouter) {
        return this.chain(
            this._region.show(this._option('viewport')),
            (viewport) => this.viewport = viewport
        );
    }

    _getLoader (name, mod) {
        return name && this._loaders[name] || mod && mod._loader || this._defaultLoader;
    }

    _createModule (name, parent) {
        const { name: moduleName, loader: loaderName } = D.Loader._analyse(name),
            loader = this._getLoader(loaderName, parent);

        return this.chain(loader.loadModule(moduleName), (options = {}) => {
            return typeCache.createModule(options.type, moduleName, this, parent, loader, options);
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
        return typeCache.createRegion(type, mod, el, regionName);
    }

    _createStore (mod, options = {}) {
        return typeCache.createStore(options.type, mod, options);
    }

    _createModel (store, options = {}) {
        return typeCache.createModel(options.type, store, options);
    }
};

Object.assign(D.Application.prototype, D.Event);
