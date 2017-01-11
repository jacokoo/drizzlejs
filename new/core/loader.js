D.Loader = class Loader {

    static _CACHE = {};
    static SCRIPT_ROOT = 'app';
    static VIEW_PREFIX = 'view-';
    static STORE = 'store';

    static register (name, loader) {
        Loader._CACHE[name] = loader;
    };

    static _analyse (name) {
        const args = name.split(':');
        const loader = args.length > 0 ? args.shift() : '';
        return { loader, name: args.shift(), args };
    };

    static _get (parent, loadString) {
        const { loader, name, args } = Loader._analyse(loadString);

        if (!loader && parent && parent._loader) {
            return { name, args, loader: parent._loader };
        }

        return { name, args, loader: Loader._CACHE[loader] };
    };

    constructor (fn) {
        this._fn = fn;
    }

    _load (name, args) {
        const obj = this._doLoad(`${Loader.SCRIPT_ROOT}/${name}`, args);
        if (!obj || !obj.then) {
            return Promise.resolve(obj);
        }
        return obj;
    }

    _doLoad (name, args) {
        return this._fn(name, args);
    }

    _doCreateModule (parent, name, args, options) {
        return this._load(name, args).then((obj = {}) => {
            const Clazz = obj.type || Module;
            return new Clazz(...[parent, name, this, obj, options]);
        });
    }

    _doCreateView (parent, name, args, options) {
        return this._load(`${parent.name}/${Loader.VIEW_PREFIX}${name}`, args).then((obj = {}) => {
            const Clazz = obj.type || View;
            return new Clazz(...[parent, name, this, obj, options]);
        });
    }

    _doCreateStore (parent, name, args, options) {
        return this._load(`${parent.name}/${Loader.STORE}`, args).then((obj = {}) => {
            const Clazz = obj.type || Store;
            const store = new Clazz(...[parent, name, this, obj, options]);

            return store._initializeModels().then(() => store);
        });
    }

    _doCreateModel (parent, name, args, options) {
        const Clazz = options.type || Model;
        return new Clazz(...[parent, name, this, options, {}]);
    }
};

map(['Module', 'View', 'Store', 'Model'], (item) => {
    Loader[`_create${item}`] = (parent, name, options) => {
        const { name: itemName, args, loader } = Loader._get(parent, name);
        return loader[`_doCreate${item}`](parent, itemName, args, options);
    };
});
