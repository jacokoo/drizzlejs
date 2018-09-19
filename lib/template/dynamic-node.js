"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const static_node_1 = require("./static-node");
const binding_1 = require("./binding");
const template_1 = require("./template");
const attributes_1 = require("./attributes");
const util_1 = require("./util");
class DynamicNode extends static_node_1.StaticNode {
    constructor() {
        super(...arguments);
        this.dynamicAttributes = {};
        this.components = {};
        this.events = {};
        this.actions = {};
        this.bindings = [];
    }
    dynamicAttribute(name, helpers) {
        this.dynamicAttributes[name] = helpers;
    }
    on(event, method, args = []) {
        this.events[event] = { method, args };
    }
    action(event, method, args = []) {
        this.actions[event] = { method, args };
    }
    bind(from, to) {
        this.bindings.push([from, to]);
    }
    component(name, helpers) {
        this.components[name] = helpers;
    }
    init(context) {
        super.init(context);
        this.bindings.forEach(([from, to]) => {
            if (from !== 'group' || this.name.toLowerCase() !== 'input')
                return;
            const attr = this.attributes.find(it => it[0].toLowerCase() === 'type');
            if (!attr)
                return;
            const type = attr[1].toLowerCase();
            if (type !== 'checkbox' && type !== 'radio')
                return;
            const groups = context.groups;
            if (!groups[to])
                groups[to] = { type, items: [], busy: false };
            else if (groups[to].type !== type) {
                throw Error('binding group can not mix up checkbox and radio');
            }
            groups[to].items.push(this); // TODO if this item is hidden by if, should it works?
        });
    }
    render(context) {
        if (this.rendered)
            return;
        super.render(context);
        this.updateAttributes(context);
        this.context = context;
        this.eventHooks = Object.keys(this.events).map(it => this.initEvent(it, this.events[it].method, this.events[it].args));
        this.actionHooks = Object.keys(this.actions).map(it => this.initAction(it, this.actions[it].method, this.actions[it].args));
        this.bindingHooks = this.bindings.map(it => binding_1.bind(this, context, it[0], it[1])).filter(it => !!it);
        this.componentHooks = Object.keys(this.components).map(it => {
            const fn = context.component(it);
            if (!fn) {
                throw new Error(`Component ${it} is not found.`);
            }
            const vs = this.renderHelper(context, this.components[it]);
            const hook = fn(this.element, ...vs[1]);
            return [it, hook];
        });
    }
    initEvent(name, method, args) {
        const me = this;
        const cb = function (event) {
            const as = util_1.resolveEventArgument(this, me.context, args, event);
            me.context.trigger(method, ...as);
        };
        return this.bindEvent(this.element, name, cb);
    }
    initAction(name, action, args) {
        const me = this;
        const cb = function (event) {
            const data = util_1.resolveEventArgument(this, me.context, args, event);
            me.context.dispatch(action, ...data);
        };
        return this.bindEvent(this.element, name, cb);
    }
    bindEvent(el, name, cb) {
        const ce = this.context.event(name);
        if (ce)
            return ce(el, cb);
        el.addEventListener(name, cb, false);
        return {
            dispose: () => {
                el.removeEventListener(name, cb, false);
            }
        };
    }
    updateAttributes(context) {
        Object.keys(this.dynamicAttributes).forEach(it => {
            const vs = this.renderHelper(context, this.dynamicAttributes[it]);
            if (vs[0] === template_1.ChangeType.CHANGED) {
                const vvs = vs[1].filter(v => v != null);
                if (vvs.length === 1) {
                    attributes_1.setAttribute(this.element, it, vvs[0]);
                }
                else {
                    const v = it === 'class' ? vvs.join(' ') : vvs.join('');
                    attributes_1.setAttribute(this.element, it, v);
                }
            }
        });
    }
    renderHelper(context, helpers) {
        const vs = helpers.map(it => it.render(context));
        if (vs.some(i => i[0] === template_1.ChangeType.CHANGED)) {
            return [template_1.ChangeType.CHANGED, vs.map(it => it[1])];
        }
        return [template_1.ChangeType.NOT_CHANGED, null];
    }
    update(context) {
        if (!this.rendered)
            return;
        this.updateAttributes(context);
        this.context = context;
        this.bindingHooks.forEach(it => it.update(context));
        this.children.forEach(it => it.update(context));
        this.componentHooks.forEach(([name, hook]) => {
            const vs = this.renderHelper(context, this.components[name]);
            if (vs[0] === template_1.ChangeType.NOT_CHANGED)
                return;
            hook.update(...vs[1]);
        });
    }
    destroy(context) {
        if (!this.rendered)
            return;
        super.destroy(context);
        this.bindingHooks.forEach(it => it.dispose());
        this.actionHooks.forEach(it => it.dispose());
        this.eventHooks.forEach(it => it.dispose());
        this.componentHooks.forEach(it => it[1].dispose());
        this.bindingHooks = [];
        this.actionHooks = [];
        this.eventHooks = [];
        this.componentHooks = [];
    }
}
exports.DynamicNode = DynamicNode;
