"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const attributes_1 = require("./attributes");
class StaticNode extends node_1.Node {
    constructor(name, id) {
        super(id);
        this.attributes = [];
        this.name = name;
        if (name === 'svg')
            this.inSvg = true;
    }
    attribute(name, value) {
        this.attributes.push([name, value]);
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        super.render(context);
        this.parent.append(this.element);
        this.children.forEach(it => it.render(context));
    }
    update(context) {
        this.children.forEach(it => it.update(context));
    }
    destroy(context) {
        if (!this.rendered)
            return;
        super.destroy(context);
        this.parent.remove(this.element);
        this.rendered = false;
    }
    create() {
        const element = this.inSvg ?
            document.createElementNS('http://www.w3.org/2000/svg', this.name) :
            document.createElement(this.name);
        this.attributes.forEach(it => attributes_1.setAttribute(element, it[0], it[1]));
        return element;
    }
}
exports.StaticNode = StaticNode;
