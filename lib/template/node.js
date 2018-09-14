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
        children.forEach((it, i) => {
            if (this.inSvg)
                it.setToSvg();
            it.nextSibling = children[i + 1];
        });
    }
    setToSvg() {
        this.inSvg = true;
        this.children.forEach(it => it.inSvg = true);
    }
    create() {
        return null;
    }
}
exports.Node = Node;
