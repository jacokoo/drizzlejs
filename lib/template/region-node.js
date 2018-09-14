"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_node_1 = require("./anchor-node");
class RegionNode extends anchor_node_1.AnchorNode {
    constructor(id = 'default') {
        super();
        this.id = id;
    }
    init(context) {
        const me = this;
        context.region(this.id, {
            get item() {
                return me.item;
            },
            show(name, state) {
                return me.show(name, state);
            },
            _showNode(nodes, ctx) {
                return me.showNode(nodes, ctx);
            },
            _showChildren() {
                if (!me.context)
                    return Promise.resolve();
                return me.showNode(me.children, me.context);
            },
            close() {
                return me.close();
            }
        });
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        super.render(context);
        this.context = context;
        this.children.forEach(it => {
            it.parent = this.newParent;
            it.init(context);
        });
    }
    update(context) {
        if (!this.rendered)
            return;
        this.context = context;
        if (this.nodes === this.children)
            this.nodes.forEach(it => it.update(context));
    }
    destroy(context) {
        if (!this.rendered)
            return;
        super.destroy(context);
        if (this.nodes)
            this.nodes.forEach(it => it.destroy(context));
        if (this.item)
            context.delay(this.item.destroy());
        this.rendered = false;
    }
    showNode(nodes, context) {
        if (!this.rendered)
            return;
        this.context = context;
        return context.end().then(() => this.close().then(() => {
            this.nodes = nodes;
            this.nodes.forEach(it => {
                it.parent = this.newParent;
                it.render(context);
            });
            return context.end();
        }));
    }
    show(name, state) {
        if (!this.rendered)
            return;
        return this.context.end().then(() => this.close().then(() => this.context.create(name, state)).then(item => {
            this.item = item;
            return item._render(this.newParent).then(() => {
                return item;
            });
        }));
    }
    close() {
        if (!this.nodes && !this.item)
            return Promise.resolve();
        return Promise.resolve().then(() => {
            if (this.nodes) {
                this.nodes.forEach(it => it.destroy(this.context));
                return this.context.end();
            }
        }).then(() => {
            if (this.item)
                return this.item.destroy();
        }).then(() => {
            this.nodes = null;
            this.item = null;
        });
    }
}
exports.RegionNode = RegionNode;
