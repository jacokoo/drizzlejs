D.Loader = class Loader extends D.Base {
    static _analyse (name) {
        if (!D.isString(name)) {
            return {loader: null, name: name};
        }

        let names = name.split(':'), loader = n;
            loader = names.length > 1 ? names.shift() : null;

        return {loader: loader, name: names.shift(), args: names};
    }

    constructor (app, options) {
        this.app = app;
        super('Default Loader', options);
    }

    loadResource (path) {
        let {scriptRoot, getResource, amd} = this.app.options,
            fullPath = `${scriptRoot}/${path}`;

        return this.Promise.create((resolve, reject) => {
            if (amd) {
                require([fullPath], ((obj) => resolve(obj)), ((e) => reject(e)));
            } else if (getResource) {
                resolve(getResource.call(this.app, fullPath));
            } else {
                resolve(require(`./${fullPath}`));
            }
        });
    }

    loadModuleResource (mod, path) {
        return this.loadResource(`${mod.name}/${path}`);
    }

    loadModule (name) {
        return this.loadResource(`${moduleName}/${this.app.options.fileNames.module}`);
    }

    loadView (name, mod) {
        return this.loadModuleResource(mod, `${this.app.options.fileNames.view}${name}`);
    }

    loadRouter (path) {

    }
}
