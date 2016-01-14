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

        Object.assign(target, {
            _listeners: {},

            listenTo (obj, name, fn) {
                (target._listeners[name] || (target._listeners[name] = [])).push({ fn, obj });
                obj.on(name, fn, target);
            },

            stopListening (obj, name, fn) {
                if (!obj) {
                    mapObj(target._listeners, (value, key) => map(value, (item) => item.obj.off(key, item.fn)));
                    target._listeners = {};
                    return;
                }

                if (!name) {
                    mapObj(target._listeners, (value, key) => map(value, (item) => me.off(key, item)));
                    target._listeners = {};
                    return;
                }

                const result = [];
                map(target._listeners[name], (item) => fn && fn !== item ? result.push(item) : me.off(name, item));
                target._listeners[name] = result;

                if (result.length === 0) delete target._listeners[name];
            },

            on (name, fn, context) {
                target.listenTo(me, name + id, context);
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
