"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
class Node {
    constructor(id) {
        this.children = [];
        this.rendered = false;
        this.inSvg = false;
        this.id = id;
    }
    init(context) {
        this.element = this.create();
        const a = util_1.createAppendable(this.element);
        this.children.forEach(it => {
            it.parent = a;
            it.init(context);
        });
    }
    render(context) {
        if (this.id && this.element)
            context.ref(this.id, this.element);
    }
    update(context) {
    }
    destroy(context) {
        this.children.forEach(it => it.destroy(context));
        if (this.id)
            context.ref(this.id);
    }
    setChildren(children) {
        this.children = children;
        if (this.inSvg)
            children.forEach(it => it.setToSvg());
    }
    setToSvg() {
        this.inSvg = true;
        this.children.forEach(it => it.inSvg = true);
    }
    clearHelper() {
        this.children.forEach(it => it.clearHelper());
    }
    create() {
        return null;
    }
}
exports.Node = Node;
