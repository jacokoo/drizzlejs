D.Promise = function(context) {
    this.context = context;
};

D.assign(D.Promise.prototype, {
    create: function(fn) {
        var ctx = this.context;
        return new A.Promise(function(resolve, reject) {
            fn.call(ctx, resolve, reject);
        });
    },

    resolve: function(data) {
        return A.Promise.resolve(data);
    },

    reject: function(data) {
        return A.Promise.reject(data);
    },

    when: function(obj) {
        var args = slice.call(arguments, 1), result;
        result = D.isFunction(obj) ? obj.apply(this.context, args) : obj;
        return A.Promise.resolve(result);
    },

    chain: function() {
        var me = this, args, prev = null, doRing = function(rings, resolve, reject, ring, i) {
            var promise;
            if (D.isArray(ring)) {
                promise = A.Promise.all(map(ring, function(item) {
                    return me.when.apply(me, i > 0 ? [item, prev] : [item]);
                }));
            } else {
                promise = me.when.apply(me, i > 0 ? [ring, prev] : [ring]);
            }

            promise.then(function(data) {
                prev = data;
                rings.length === 0 ? resolve(prev) : doRing(rings, resolve, reject, rings.shift(), i + 1);
            }, function(data) {
                reject(data);
            });
        };

        args = slice.call(arguments);
        if (args.length === 0) return this.resolve();

        return this.create(function(resolve, reject) {
            doRing(args, resolve, reject, args.shift(), 0);
        });
    }
});
