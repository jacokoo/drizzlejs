"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./loader");
const module_1 = require("./module");
const util_1 = require("./template/util");
const event_1 = require("./event");
const customEvents = {
    enter(node, cb) {
        const ee = function (e) {
            if (e.keyCode !== 13)
                return;
            e.preventDefault();
            cb.call(this, e);
        };
        node.addEventListener('keypress', ee, false);
        return {
            dispose() {
                node.removeEventListener('keypress', ee, false);
            }
        };
    }
};
class Application extends event_1.Events {
    constructor(options) {
        super();
        this.loaders = {};
        this._plugins = [];
        this.options = Object.assign({
            stages: ['init', 'template', 'default'],
            scriptRoot: 'app',
            entry: 'viewport',
            helpers: {},
            components: {},
            moduleLifecycles: [],
            viewLifecycles: []
        }, options);
        this.options.customEvents = Object.assign(customEvents, this.options.customEvents);
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
    use(plugin) {
        plugin.init(this);
        this.options.moduleLifecycles = this.options.moduleLifecycles.concat(plugin.moduleLifecycles);
        this.options.viewLifecycles = this.options.viewLifecycles.concat(plugin.viewLifecycles);
        this._plugins.push(plugin);
    }
    start() {
        return this.startViewport().then(item => {
            this._plugins.forEach(it => it.started(item));
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
}
exports.Application = Application;
