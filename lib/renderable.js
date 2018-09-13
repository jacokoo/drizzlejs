"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lifecycle_1 = require("./lifecycle");
var ComponentState;
(function (ComponentState) {
    ComponentState[ComponentState["CREATED"] = 0] = "CREATED";
    ComponentState[ComponentState["INITED"] = 1] = "INITED";
    ComponentState[ComponentState["RENDERED"] = 2] = "RENDERED";
})(ComponentState = exports.ComponentState || (exports.ComponentState = {}));
class Renderable extends lifecycle_1.LifecycleContainer {
    constructor(app, options, ...args) {
        super(app, options, ...args);
        this.ids = {};
        this._busy = Promise.resolve();
        this._status = ComponentState.CREATED;
        this._options = options;
    }
    _render(target) {
        if (this._status !== ComponentState.INITED)
            return Promise.resolve();
        this._target = target;
        this._busy = this._busy
            .then(() => this._doBeforeRender())
            .then(() => this._doCollect(this.get()))
            .then(data => this._doRendered(data))
            .then(() => this._status = ComponentState.RENDERED);
        return this._busy;
    }
    destroy() {
        if (this._status !== ComponentState.RENDERED)
            return Promise.resolve();
        this._busy = this._busy
            .then(() => this._doBeforeDestroy())
            .then(() => this._doDestroyed())
            .then(() => this._status = ComponentState.INITED);
        return this._busy;
    }
    _init() {
        return this._busy = this._busy
            .then(() => this._doInit())
            .then(() => this._status = ComponentState.INITED);
    }
    _event(name, ...args) {
        const { events } = this._options;
        if (events && events[name])
            events[name].apply(this, args);
    }
    _action(name, ...data) {
        const { actions } = this._options;
        if (actions && actions[name]) {
            actions[name].call(this, (d) => {
                return this._dispatch(name, d);
            }, ...data);
            return;
        }
        this._dispatch(name, data[0]);
    }
}
exports.Renderable = Renderable;
