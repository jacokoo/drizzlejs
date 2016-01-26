D.Event = {
    on (name, fn, ctx) {
        this._events || (this._events = {});
        (this._events[name] || (this._events[name] = [])).push({ fn, ctx });
    },

    off (name, fn) {
        if (!this._events || !name || !this._events[name]) return;
        if (!fn) {
            delete this._events[name];
            return;
        }

        const result = [];
        map(this._events[name], (item) => {if (item.fn !== fn) result.push(item);});

        if (result.length === 0) {
            delete this._events[name];
            return;
        }
        this._events[name] = result;
    },

    trigger (name, ...args) {
        if (!name || !this._events || !this._events[name]) return this;
        map(this._events[name], (item) => item.fn.apply(item.ctx, args));
    },

    delegateEvent (to) {
        const me = this, id = '--' + to.id, target = to;

        assign(target, {
            _listeners: {},

            listenTo (obj, name, fn, ctx) {
                (target._listeners[name] || (target._listeners[name] = [])).push({ fn, obj });
                obj.on(name, fn, ctx || target);
            },

            stopListening (obj, name, fn) {
                mapObj(target._listeners, (value, key) => {
                    const result = [];
                    map(value, (item) => {
                        let offIt = fn && (item.fn === fn && name === key && obj === item.obj);
                        offIt = offIt || (!fn && name && (name === key && obj === item.obj));
                        offIt = offIt || (!fn && !name && obj && obj === item.obj);
                        offIt = offIt || (!fn && !name && !obj);
                        if (offIt) {
                            item.obj.off(key, item.fn);
                            return;
                        }
                        result.push(item);
                    });

                    target._listeners[key] = result;
                    if (result.length === 0) {
                        delete target._listeners[key];
                    }
                });
            },

            on (name, fn, ctx) {
                target.listenTo(me, name + id, fn, ctx);
            },

            off (name, fn) {
                target.stopListening(me, (name && name + id), fn);
            },

            trigger (name, ...args) {
                if (!name) return target;
                args.unshift(name + id) && me.trigger(...args);
            }
        });
        return this;
    }
};
