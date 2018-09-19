"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Events {
    constructor() {
        this._handlers = {};
    }
    on(name, handler) {
        if (!this._handlers[name])
            this._handlers[name] = [];
        const hs = this._handlers[name];
        if (hs.indexOf(handler) !== -1)
            return { dispose: () => { } };
        hs.push(handler);
        return {
            dispose: () => {
                const idx = hs.indexOf(handler);
                if (idx !== -1)
                    hs.splice(idx, 1);
            }
        };
    }
    fire(name, data) {
        if (!this._handlers[name])
            return;
        const hs = this._handlers[name].slice();
        hs.forEach(it => it.call(this, data));
    }
}
exports.Events = Events;
