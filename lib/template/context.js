"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractDataContext {
    constructor(root, data, groups, busy) {
        this.groups = {};
        this.data = {};
        this.root = root;
        this.data = data || {};
        this.groups = groups || {};
        this.busy = busy || [];
    }
    name() {
        return this.root._options._file;
    }
    update(data) {
        this.root.set(data);
    }
    trigger(name, ...args) {
        this.root._event(name, ...args);
    }
    dispatch(name, ...args) {
        this.root._action(name, ...args);
    }
    ref(id, node) {
        if (node)
            this.root.ids[id] = node;
        else
            delete this.root.ids[id];
    }
    region(id, region) {
        this.root.regions[id] = region;
    }
    delay(p) {
        this.busy.push(p);
    }
    end() {
        const p = this.busy.slice(0);
        this.busy = [];
        return Promise.all(p);
    }
    event(name) {
        const ce = this.root._options.customEvents;
        return (ce && ce[name]) || this.root.app.options.customEvents[name];
    }
    computed(name) {
        const c = this.root._options.computed;
        return c && c[name];
    }
}
class ViewDataContext extends AbstractDataContext {
    sub(data) {
        return new ViewDataContext(this.root, data, this.groups, this.busy);
    }
    create(name, state) {
        const p = this.root._module._createItem(name, state);
        this.delay(p);
        return p;
    }
    helper(name) {
        const h = this.root._options.helpers;
        return (h && h[name]) || this.root.app.options.helpers[name];
    }
    component(name) {
        const c = this.root._options.components;
        return (c && c[name]) || this.root.app.options.components[name];
    }
}
exports.ViewDataContext = ViewDataContext;
class ModuleDataContext extends AbstractDataContext {
    sub(data) {
        return new ModuleDataContext(this.root, data, this.groups, this.busy);
    }
    create(name, state) {
        const p = this.root._createItem(name, state);
        this.delay(p);
        return p;
    }
    helper(name) {
        return;
    }
    component(name) {
        return;
    }
}
exports.ModuleDataContext = ModuleDataContext;
