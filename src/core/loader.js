Loader = D.Loader = function(app) {
    this.app = app;
    this.name = 'loader';
    this.fileNames = app.options.fileNames;
    parent(Loader).call(this, 'L');
};

Loader.analyse = function(name) {
    var names, loader = null;
    if (!D.isString(name)) {
        return { loader: null, name: name };
    }

    names = name.split(':');
    if (names.length < 2) {
        name = names.shift();
    } else {
        loader = names.shift();
        name = names.shift();
    }

    return { loader: loader, name: name, args: names };
};

extend(Loader, Base, {
    loadResource: function(path) {
        var me = this, options = me.app.options,
            fullPath = compose(options.scriptRoot, path);

        return me.Promise.create(function(resolve, reject) {
            if (options.amd) {
                require([fullPath], function(obj) {
                    resolve(obj);
                }, function(e) {
                    reject(e);
                });
            } else if (options.getResource) {
                resolve(options.getResource(fullPath));
            } else {
                resolve(require('./' + fullPath));
            }
        });
    },

    loadModuleResource: function(mod, path) {
        return this.loadResource(compose(mod.name, path));
    },

    loadModule: function(path, parentModule) {
        var name = Loader.analyse(path).name;
        path = compose(name, this.fileNames.module);
        return chain(this, this.loadResource(compose(path)), function(options) {
            var mod = new Module(name, this.app, this, options);
            if (parentModule) mod.module = parentModule;
            return mod;
        });
    },

    loadView: function(name, mod) {
        var n = Loader.analyse(name).name, path = this.fileNames.view + n;
        return chain(this, this.loadModuleResource(mod, path), function(options) {
            options || (options = {});
            return View.create(options.type, n, mod, this, options);
        });
    },

    loadTemplate: function(mod) {
        return this.loadModuleResource(mod, this.fileNames.templates);
    },

    loadSeparatedTemplate: function(view, name) {
        return this.loadModuleResource(view.module, this.fileNames.template + name);
    },

    loadRouter: function(path) {
        var name = Loader.analyse(path).name;
        return this.loadResource(compose(name, this.fileNames.router));
    }
});

SimpleLoader = D.SimpleLoader = function() {
    parent(SimpleLoader).apply(this, arguments);
    this.name = 'simple';
};

extend(SimpleLoader, Loader, {
    loadModule: function(name, parentModule) {
        var n = Loader.analyse(name).name,
            mod = new Module(n, this.app, this, {separatedTemplate: true});

        if (parentModule) mod.module = parentModule;

        return this.Promise.resolve(mod);
    },

    loadView: function(name, mod) {
        name = Loader.analyse(name).name;
        return this.Promise.resolve(new View(name, mod, this, {}));
    }
});
