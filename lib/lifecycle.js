"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const callIt = (ctx, cycles, method, reverse = false) => {
    return cycles.filter(it => it[method])[reverse ? 'reduceRight' : 'reduce']((acc, it) => {
        return acc.then(() => it[method].apply(ctx));
    }, Promise.resolve());
};
class LifecycleContainer {
    constructor(app, options, ...args) {
        this._cycles = [];
        this.app = app;
        const cs = options.cycles || [];
        cs.push(options);
        args.forEach(it => it && cs.push(it));
        cs.forEach(it => !it.stage && (it.stage = 'default'));
        app.options.stages.forEach(s => cs.forEach(c => {
            if (c.stage === s)
                this._cycles.push(c);
        }));
    }
    _doInit() {
        return callIt(this, this._cycles, 'init');
    }
    _doBeforeRender() {
        return callIt(this, this._cycles, 'beforeRender');
    }
    _doRendered() {
        return callIt(this, this._cycles, 'rendered');
    }
    _doBeforeUpdate() {
        return callIt(this, this._cycles, 'beforeUpdate');
    }
    _doUpdated() {
        return callIt(this, this._cycles, 'updated');
    }
    _doBeforeDestroy() {
        return callIt(this, this._cycles, 'beforeDestroy', true);
    }
    _doDestroyed() {
        return callIt(this, this._cycles, 'destroyed', true);
    }
}
exports.LifecycleContainer = LifecycleContainer;
