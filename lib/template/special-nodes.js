"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamic_node_1 = require("./dynamic-node");
class WindowNode extends dynamic_node_1.DynamicNode {
    constructor(id) {
        super('window', id);
        this.children = [];
    }
    init() { }
    dynamicAttribute() { }
    component() { }
    bind(from, to) {
        if (from !== 'scrollX' && from !== 'scrollY') {
            throw new Error('Can only bind scrollX and scrollY on window object');
        }
        super.bind(from, to);
    }
    bindEvent(el, name, cb) {
        return super.bindEvent(window, name, cb);
    }
}
exports.WindowNode = WindowNode;
class ApplicationNode extends dynamic_node_1.DynamicNode {
    constructor(id) {
        super('app', id);
        this.children = [];
    }
    init() { }
    dynamicAttribute() { }
    component() { }
    bind() { }
    bindEvent(el, name, cb) {
        return this.context.root.app.on(name, cb);
    }
}
exports.ApplicationNode = ApplicationNode;
