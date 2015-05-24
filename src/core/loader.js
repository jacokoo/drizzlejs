D.Loader = function(app) {
    this.app = app;
    this.name = 'loader';
    this.fileNames = app.options.fileNames;
    D.Loader.__super__.constructor.call(this, 'L');
};

D.Loader.analyse = function(name) {
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

D.extend(D.Loader, D.Base, {
    loadResource: function(path) {
        path = compose(this.app.options.scriptRoot, path);
        return this.Promise.create(function(resolve, reject) {
            if (this.app.options.amd) {
                require([path], function(obj) {
                    resolve(obj);
                }, function(e) {
                    reject(e);
                });
            } else {
                resolve(require('./' + path));
            }
        });
    },

    loadModuleResource: function(module, path) {
        return this.loadResource(compose(module.name, path));
    },

    loadModule: function(path, parent) {
        var name = D.Loader.analyse(path).name;
        path = compose(name, this.fileNames.module);
        return this.Promise.chain(this.loadResource(compose(path)), function(options) {
            var module = new D.Module(name, this.app, this, options);
            if (parent) module.module = parent;
            return module;
        });
    },

    loadView: function(name, module) {
        var n = D.Loader.analyse(name).name, path = this.fileNames.view + n;
        return this.Promise.chain(this.loadModuleResource(module, path), function(options) {
            options || (options = {});
            return D.View.create(options.type, n, module, this, options);
        });
    },

    loadTemplate: function(module) {
        return this.loadModuleResource(module, this.fileNames.templates);
    },

    loadSeparatedTemplate: function(view, name) {
        return this.loadModuleResource(module, this.fileNames.template + name);
    },

    loadRouter: function(path) {
        var name = D.Loader.analyse(path).name;
        return this.loadResource(compose(name, this.fileNames.router));
    }
});

D.SimpleLoader = function() {
    D.SimpleLoader.__super__.constructor.apply(this, arguments);
    this.name = 'simple';
};

D.extend(D.SimpleLoader, D.Loader, {
    loadModule: function(name, parent) {
        var n = D.Loader.analyse(name).name,
            module = new D.Module(n, this.app, this, {separatedTemplate: true});

        if (parent) module.module = parent;

        return this.Promise.resolve(module);
    },

    loadView: function(name, module) {
        name = D.Loader.analyse(name).name;
        return this.Promise.resolve(new D.View(name, module, this, {}));
    }
});
