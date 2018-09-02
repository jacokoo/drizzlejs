"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./loader");
const module_1 = require("./module");
const util_1 = require("./template/util");
class Application {
    constructor(options) {
        this.loaders = {};
        this.options = Object.assign({
            stages: ['init', 'template', 'default'],
            scriptRoot: 'app',
            entry: 'viewport'
        }, options);
        this.registerLoader(loader_1.Loader);
    }
    registerLoader(loader, name = 'default') {
        this.loaders[name] = loader;
    }
    createLoader(path, loader) {
        if (loader) {
            return new this.loaders[loader.name](this, path, loader.args);
        }
        return new this.loaders.default(this, path);
    }
    start() {
        return this.startViewport().then(item => {
            console.log(item);
            this.startRouter(item);
        });
    }
    startViewport() {
        let loader;
        const { entry, container } = this.options;
        const create = (lo, options) => {
            const v = new module_1.Module(this, lo, options);
            return v._init().then(() => v._render(util_1.createAppendable(container))).then(() => v);
        };
        if (typeof entry === 'string') {
            loader = this.createLoader(entry);
        }
        else {
            return create(this.createLoader(null), entry);
        }
        return loader.load('index', null).then(opt => create(loader, opt));
    }
    startRouter(item) {
        if (!item._router)
            return;
        const doIt = () => {
            const hash = window.location.hash;
            if (hash.slice(0, 2) !== '#/')
                return;
            const hs = hash.slice(2).split('/').filter(it => !!it);
            if (!hs.length)
                return;
            item._router.route(hs).then(it => {
                console.log(it);
            });
        };
        window.addEventListener('popstate', doIt);
        doIt();
    }
}
exports.Application = Application;
