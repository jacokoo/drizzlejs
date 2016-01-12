D.Loader = class Loader extends D.Base {
    static _analyse (name) {
        if (!D.isString(name)) {
            return { loader: null, name };
        }

        const args = name.split(':'),
            loader = args.length > 1 ? args.shift() : null;

        return { loader, name: args.shift(), args };
    }

    constructor (app, options) {
        super('Loader', options, { app });
    }

    loadResource (path) {
        const { scriptRoot, getResource, amd } = this.app.options,
            fullPath = `${scriptRoot}/${path}`;

        return this.Promise.create((resolve, reject) => {
            if (amd) {
                require([fullPath], (obj) => resolve(obj), (e) => reject(e));
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
        return this.loadResource(`${name}/${this.app.options.fileNames.module}`);
    }

    loadView (name, mod) {
        return this.loadModuleResource(mod, `${this.app.options.fileNames.view}${name}`);
    }

    loadRouter (path) {
        return this.loadResource(`${path}/${this.app.options.fileNames.router}`);
    }
};
