Event = D.Event = {
    on: function(name, callback, context) {
        this.events || (this.events = {});
        this.events[name] || (this.events[name] = []);
        this.events[name].push({fn: callback, ctx: context});
        return this;
    },

    off: function(name, callback, context) {
        var me = this, result;
        if (!me.events || !name || !me.events[name]) return me;
        if (!callback) return (delete me.events[name]) && this;

        result = [];
        map(me.events[name], function(item) {
            if (item.fn !== callback || (context && context !== item.ctx)) {
                result.push(item);
            }
        });

        me.events[name] = result;
        if (!me.events[name].length) delete me.events[name];
        return me;
    },

    trigger: function(name) {
        var args;
        if (!name || !this.events || !this.events[name]) return this;
        args = slice.call(arguments, 1);

        map(this.events[name], function(item) {
            item.fn.apply(item.ctx, args);
        });
        return this;
    },

    delegateEvent: function(target) {
        var me = this, id = '--' + target.id;
        Drizzle.assign(target, {
            on: function(name, callback, context) {
                target.listenTo(me, name + id, callback, context);
                return target;
            },

            off: function(name, callback) {
                target.stopListening(me, (name && name + id), callback);
                return target;
            },

            trigger: function(name) {
                var args;
                if (!name) return target;

                args = slice.call(arguments, 1);
                args.unshift(name + id);
                me.trigger.apply(me, args);
                return target;
            },

            listenTo: function(obj, name, callback, context) {
                var ctx = context || target;
                target.listeners || (target.listeners = {});
                target.listeners[name] || (target.listeners[name] = []);
                target.listeners[name].push({obj: obj, fn: callback, ctx: ctx});

                obj.on(name, callback, ctx);
                return target;
            },

            stopListening: function(obj, name, callback) {
                if (!target.listeners) return target;

                if (!obj) {
                    mapObj(target.listeners, function(value, key) {
                        map(value, function(item) {
                            item.obj.off(key, item.fn, item.ctx);
                        });
                    });
                    target.listeners = {};
                    return target;
                }

                mapObj(target.listeners, function(value, key) {
                    if (name && name !== key) return;

                    target.listeners[key] = [];
                    map(value, function(item) {
                        if (item.obj !== obj || (callback && callback !== item.fn)) {
                            target.listeners[key].push(item);
                        } else {
                            item.obj.off(key, item.fn, item.ctx);
                        }
                    });
                });

                return target;
            }
        });
        return me;
    }
};
