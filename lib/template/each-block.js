"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const anchor_node_1 = require("./anchor-node");
class EachBlock extends anchor_node_1.AnchorNode {
    constructor(args, trueNode, falseNode) {
        super();
        this.currentSize = 0;
        this.nodes = [];
        this.args = args;
        this.trueNode = trueNode;
        this.falseNode = falseNode;
    }
    isEmpty(list) {
        return !list || (Array.isArray(list) && !list.length) || (typeof list === 'object' && !Object.keys(list));
    }
    sub(context, i) {
        const o = Object.assign({}, context.data);
        if (!o._each)
            o._each = [];
        else
            o._each = o._each.slice(0);
        const v = util_1.getValue(this.args[0], context);
        o._each.push({ list: v, index: i, key: this.args[2], name: this.args[0] });
        o[this.args[2]] = v[i];
        if (this.args[3])
            o[this.args[3]] = i;
        return context.sub(o);
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        super.render(context);
        if (this.falseNode)
            this.falseNode.parent = this.newParent;
        const list = util_1.getValue(this.args[0], context);
        if (this.isEmpty(list)) {
            this.renderElse(context);
            return;
        }
        const kv = Array.isArray(list) ?
            list.map((it, i) => [i, it]) :
            Object.keys(list).map(it => [it, list[it]]);
        this.renderKeyValue(kv, context);
    }
    createTrueNode(i, context) {
        const n = this.trueNode();
        n.parent = this.newParent;
        this.nodes[i] = n;
        n.init(context);
        context.delay(context.end().then(() => n.render(context)));
    }
    renderKeyValue(arr, context) {
        this.currentSize = arr.length;
        arr.forEach((it, i) => {
            const sub = this.sub(context, i);
            this.createTrueNode(i, sub);
        });
    }
    renderElse(context) {
        if (!this.falseNode)
            return;
        this.falseNode.init(context);
        this.falseNode.render(context);
    }
    update(context) {
        if (!this.rendered)
            return;
        const list = util_1.getValue(this.args[0], context);
        const empty = this.isEmpty(list);
        if (empty && !this.currentSize) {
            this.updateElse(context);
            return;
        }
        if (empty) {
            this.currentSize = 0;
            this.nodes.forEach(it => it.destroy(context));
            this.nodes = [];
            this.renderElse(context);
            return;
        }
        const kv = Array.isArray(list) ?
            list.map((it, i) => [i, it]) :
            Object.keys(list).map(it => [it, list[it]]);
        this.updateKeyValue(kv, context);
    }
    updateElse(context) {
        if (this.falseNode)
            this.falseNode.update(context);
    }
    updateKeyValue(arr, context) {
        this.currentSize = arr.length;
        arr.forEach((it, i) => {
            const sub = this.sub(context, i);
            if (this.nodes[i]) {
                this.nodes[i].clearHelper();
                this.nodes[i].update(sub);
            }
            else {
                this.createTrueNode(i, sub);
            }
        });
        while (this.nodes.length !== this.currentSize) {
            const node = this.nodes.pop();
            node.destroy(context);
        }
    }
    destroy(context) {
        if (!this.rendered)
            return;
        super.destroy(context);
        if (!this.currentSize) {
            if (this.falseNode)
                this.falseNode.destroy(context);
            return;
        }
        this.currentSize = 0;
        this.nodes.forEach(it => it.destroy(context));
        this.nodes = [];
        this.rendered = false;
    }
}
exports.EachBlock = EachBlock;
