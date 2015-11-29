D.Event = {
    on (name, fn, context) {
        this._events || (this._events = {});
        (this._events[name] || (this._events[name] = [])).push({fn: fn, ctx: context});
    },

    off (name, fn) {
        if (!this._events || !name || !this._events[name]) return;
        if (!fn) return delete this._events[name];

        let result = [];
        map(this._events[name], (item) => {if (item.fn !== fn) result.push(item)});

        if (result.length === 0) return (delete this._events[name]);
        this._events[name] = result;
    },

    trigger (name, ...args) {
        if (!name || !this._events || !this._events[name]) return this;
        map(this._events[name], (item) => item.fn.apply(item.ctx, args));
    },

    delegateEvent (target) {
        let me = this, id = '--' + target.id;

        Object.assign(target, {
            _listeners: {},

            on (name, fn) {
                (target._listeners[name] || (target._listeners[name] = [])).push(fn)
                me.on(name, fn, target);
            },

            off (name, fn) {
                if (!name) {
                    mapObj(target._listeners, (value, key) => map(value, (item) => me.off(key, item)));
                    target._listeners = {};
                    return;
                }

                let result = [];
                map(target._listeners[name], (item) => fn && fn !== item ? result.push(item) : me.off(name, item));
                target._listeners[name] = result;

                if (result.length === 0) delete target._listeners[name];
            },

            trigger (name, ...args) {
                if (!name) return target;
                args.unshift(name + id) && me.trigger(...args);
            }
        });
        return this;
    }
};
