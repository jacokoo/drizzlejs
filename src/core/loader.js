D.Loader = function Loader (app, options) {
    D.Loader.__super__.constructor.call(this, 'Loader', options, { app });
};

D.assign(D.Loader, {
    _analyse (name) {
        if (!D.isString(name)) {
            return { loader: null, name };
        }

        const args = name.split(':'),
            loader = args.length > 1 ? args.shift() : null;

        return { loader, name: args.shift(), args };
    }
});

D.extend(D.Loader, D.Base, {
    loadResource (path) {
        const { scriptRoot, getResource, amd } = this.app.options,
            fullPath = `${scriptRoot}/${path}`;

        return this.Promise.create((resolve, reject) => {
            if (amd) {
                require([fullPath], resolve, reject);
            } else if (getResource) {
                resolve(getResource.call(this.app, fullPath));
            } else {
                resolve(require(`./${fullPath}`));
            }
        });
    },

    loadModuleResource (mod, path) {
        return this.loadResource(`${mod.name}/${path}`);
    },

    loadModule (name) {
        return this.loadResource(`${name}/index`);
    },

    loadView (name, mod) {
        return this.loadModuleResource(mod, `view-${name}`);
    },

    loadRouter (path) {
        const name = 'router';
        return this.loadResource(path ? `${path}/${name}` : name);
    }
});
