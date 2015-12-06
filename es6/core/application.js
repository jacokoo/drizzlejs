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
            _loaders: {},
            _regions: []
        });
    }

    _initialize () {
        this._templateEngine = this._option('templateEngine');
    }

    registerLoader (name, loader, isDefault) {
        this.loaders[name] = loader;
        if (isDefault) this._defaultLoader = loader;
    }

    _getLoader (name) {
        return name && this._loaders[name] || this._defaultLoader;
    }

    _createModule (name, parent) {
        let {name: moduleName, loader: loaderName} = D.Loader._analyse(name),
            loader = this._getLoader(loaderName);

        return this.chain(loader.loadModule(moduleName), (options = {}) => {
            return typeCache.createModule(options.type, moduleName, this, loader, options, parent);
        });
    }

    _createView (name, mod) {
        let {name: viewName, loader: loaderName} = D.Loader._analyse(name),
            loader = this._getLoader(loaderName);

        return this.chain(loader.loadView(viewName, mod), (options = {}) => {
            return typeCache.createView(options.type, viewName, mod, loader, options);
        });
    }

    _createRegion (el, name, mod) {

    }
};

Object.assign(D.Application.prototype, D.Event);
