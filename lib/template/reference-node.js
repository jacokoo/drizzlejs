"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../module");
const static_node_1 = require("./static-node");
const anchor_node_1 = require("./anchor-node");
const util_1 = require("./util");
class ReferenceNode extends anchor_node_1.AnchorNode {
    constructor(name, id) {
        super(id);
        this.events = {};
        this.actions = {};
        this.mappings = [];
        this.grouped = {};
        this.statics = {};
        this.hooks = [];
        this.name = name;
    }
    attribute(name, value) {
        this.statics[name] = value;
    }
    map(from, to) {
        this.mappings.push([from, to || from]);
    }
    on(event, method, args) {
        this.events[event] = { method, args };
    }
    action(event, method, args) {
        this.actions[event] = { method, args };
    }
    init(context) {
        const fn = (i) => {
            this.item = i;
            if (this.id)
                context.ref(this.id, i);
        };
        context.create(this.name, this.statics).then(fn);
        this.children.forEach(it => {
            let name = 'default';
            if (it instanceof static_node_1.StaticNode) {
                const attr = it.attributes.find(n => n[0] === 'region');
                if (attr)
                    name = attr[1];
            }
            it.init(context);
            if (!this.grouped[name])
                this.grouped[name] = [];
            this.grouped[name].push(it);
        });
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        super.render(context);
        context.delay(this.item.set(this.mappings.reduce((acc, item) => {
            acc[item[1]] = util_1.getValue(item[0], context);
            return acc;
        }, {})));
        context.delay(this.item._render(this.newParent).then(() => {
            return Promise.all(Object.keys(this.grouped).map(k => {
                if (!this.item.regions[k])
                    return;
                return this.item.regions[k]._showNode(this.grouped[k], context);
            }).concat(Object.keys(this.item.regions).map(it => {
                if (!this.grouped[it] || !this.grouped[it].length)
                    return this.item.regions[it]._showChildren();
            })));
        }));
        this.context = context;
        let cbs = [];
        if (this.item instanceof module_1.Module) {
            const m = this.item;
            cbs = cbs.concat(this.bindEvents(context));
            cbs = cbs.concat(this.bindActions(context));
            this.hooks = cbs.map(it => m.on(it.event, it.fn));
        }
    }
    bindEvents(context) {
        const me = this;
        return Object.keys(this.events).map(it => {
            const cb = function (event) {
                const data = util_1.resolveEventArgument(this, me.context, me.events[it].args, event);
                context.trigger(me.events[it].method, ...data);
            };
            return { fn: cb, event: it };
        });
    }
    bindActions(context) {
        const me = this;
        return Object.keys(this.actions).map(it => {
            const cb = function (event) {
                const data = util_1.resolveEventArgument(this, me.context, me.actions[it].args, event);
                context.dispatch(me.actions[it].method, ...data);
            };
            return { fn: cb, event: it };
        });
    }
    update(context) {
        context.delay(this.item.set(this.mappings.reduce((acc, item) => {
            acc[item[1]] = util_1.getValue(item[0], context);
            return acc;
        }, {})));
        this.context = context;
        this.children.forEach(it => it.update(context));
    }
    destroy(delay) {
        if (!this.rendered)
            return;
        super.destroy(delay);
        this.context.delay(this.item.destroy());
        this.hooks.forEach(it => it.dispose());
        this.hooks = [];
        this.context.delay(Promise.all(Object.keys(this.grouped).map(it => {
            if (!this.item.regions[it])
                return;
            return this.item.regions[it].close();
        })));
        this.rendered = false;
    }
}
exports.ReferenceNode = ReferenceNode;
