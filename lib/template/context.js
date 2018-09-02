"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.components = {};
exports.helpers = {};
exports.customEvents = {};
class AbstractDataContext {
    constructor(root, data, groups, busy) {
        this.groups = {};
        this.data = {};
        this.root = root;
        this.data = data || {};
        this.groups = groups || {};
        this.busy = busy || Promise.resolve();
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
        this.busy = this.busy.then(() => p);
    }
    end() {
        return this.busy;
    }
    event(name) {
        return this.root._options.customEvents[name] || exports.customEvents[name];
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
        return this.root._options.helpers[name] || exports.helpers[name];
    }
    component(name) {
        return this.root._options.components[name] || exports.components[name];
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
