D.Loader = class Loader {

    static CACHE = {};
    static SCRIPT_ROOT = 'app';

    static register (name, loader) {
        Loader.CACHE[name] = loader;
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

        return { name, args, loader: Loader.CACHE[loader] };
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

    _doCreateModule (parent, name, loader, obj) {
        if (!isFunction(obj)) throw new Error('Incorrect module definition: ${name}');
        const builder = new Module.Builder(parent, name, loader);
        obj(builder);
        return builder._build();
    }

    _doCreateView (parent, name, loader, obj) {
        if (!isFunction(obj)) throw new Error('Incorrect view definition: ${name}');
        const builder = new View.Builder(parent, name, loader);
        obj(builder);
        return builder._build();
    }
};

map(['Module', 'View'], (item) => {
    Loader[`_create${item}`] = (parent, name) => {
        const { name: itemName, args, loader } = Loader._get(parent, name);
        return loader._load(itemName, args).then(obj => {
            return loader[`_doCreate${item}`](parent, itemName, loader, obj);
        });
    };
});
