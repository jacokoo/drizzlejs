D.Event = {
    on: function(name, callback, context) {
        this.events || (this.events = {});
        this.events[name] || (this.events[name] = []);
        this.events[name].push({fn: callback, ctx: context});
        return this;
    },

    off: function(name, callback, context) {
        if (!this.events || !name || !this.events[name]) return this;
        if (!callback) return (delete this.events[name]) && this;
        map(this.events[name], function(item) {
            var result = [];
            if (item.fn !== callback || (context && context !== item.ctx)) {
                result.push(item);
            }
            this.events[name] = result;
        }, this);

        if (!this.events[name].length) delete this.events[name];
        return this;
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
            on: function(name, callback) {
                target.listenTo(me, name + id, callback);
                return this;
            },

            off: function(name, callback) {
                target.stopListening(me, (name && name + id), callback);
                return this;
            },

            trigger: function(name) {
                var args;
                if (!name) return this;

                args = slice.call(arguments);
                args.unshift(name + id);
                me.trigger.apply(me, args);
                return this;
            },

            listenTo: function(obj, name, callback) {
                this.listeners || (this.listeners = {});
                this.listeners[name] || (this.listeners[name] = []);
                this.listeners[name].push({obj: obj, fn: callback});

                obj.on(name, callback, this);
                return this;
            },

            stopListening: function(obj, name, callback) {
                if (!this.listeners) return this;

                if (!obj) {
                    mapObj(this.listeners, function(value, key) {
                        map(value, function(item) {
                            item.obj.off(key, item.fn, this);
                        }, this);
                    }, this);
                    this.listeners = {};
                    return this;
                }

                mapObj(this.listeners, function(value, key) {
                    if (name && name !== key) return;

                    this.listeners[key] = [];
                    map(value, function(item) {
                        if (item.obj !== obj || (callback && callback !== item.fn)) {
                            this.listeners[key].push(item);
                        } else {
                            item.obj.off(key, item.fn, this);
                        }
                    }, this);
                }, this);

                return this;
            }
        });
        return this;
    }
};
