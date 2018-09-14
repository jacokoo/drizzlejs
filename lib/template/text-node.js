"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const helper_1 = require("./helper");
const node_1 = require("./node");
class StaticTextNode extends node_1.Node {
    constructor(data = '') {
        super();
        this.data = data;
        this.node = document.createTextNode(this.data);
    }
    init() { }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        this.parent.append(this.node);
    }
    destroy(context) {
        if (!this.rendered)
            return;
        super.destroy(context);
        this.parent.remove(this.node);
        this.rendered = false;
    }
}
class DynamicTextNode extends StaticTextNode {
    constructor(helper) {
        super();
        this.helper = helper;
    }
    render(context) {
        super.render(context);
        this.update(context);
    }
    update(context) {
        const r = this.helper.render(context);
        if (r[0] === template_1.ChangeType.CHANGED) {
            this.node.data = r[1] == null ? '' : r[1];
        }
    }
}
class HtmlDynamicTextNode extends node_1.Node {
    constructor(helper) {
        super();
        this.helper = new helper_1.ConcatHelper(...helper.args);
    }
    init() {
        this.begin = document.createElement('noscript');
        this.end = document.createElement('noscript');
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        this.parent.append(this.begin);
        this.parent.append(this.end);
        this.update(context);
    }
    update(context) {
        const r = this.helper.render(context);
        if (r[0] === template_1.ChangeType.CHANGED) {
            this.remove();
            this.begin.insertAdjacentHTML('afterend', r[1]);
        }
    }
    remove() {
        while (this.begin.nextSibling && this.begin.nextSibling !== this.end) {
            this.begin.parentNode.removeChild(this.begin.nextSibling);
        }
    }
    destroy(context) {
        if (!this.rendered)
            return;
        this.rendered = false;
        this.remove();
        this.parent.remove(this.end);
        this.parent.remove(this.begin);
    }
}
class TextNode extends node_1.Node {
    constructor(...args) {
        super();
        this.nodes = args.map(it => {
            if (typeof it === 'string')
                return new StaticTextNode(it);
            if (it.name === 'html')
                return new HtmlDynamicTextNode(it);
            return new DynamicTextNode(it);
        });
    }
    init(context) {
        this.nodes.forEach(it => {
            it.parent = this.parent;
            it.init(context);
        });
    }
    render(context) {
        this.nodes.forEach(it => {
            if (!it.parent)
                it.parent = this.parent;
            it.render(context);
        });
    }
    update(context) {
        this.nodes.forEach(it => it.update(context));
    }
    destroy(context) {
        this.nodes.forEach(it => it.destroy(context));
    }
}
exports.TextNode = TextNode;
