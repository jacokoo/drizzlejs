D.Base = function(idPrefix, options) {
    this.options = options || {};
    this.id = D.uniqueId(idPrefix);
    this.Promise = new D.Promise(this);
    this.initialize();
};

D.assign(D.Base.prototype, {
    initialize: FN,

    option: function(key) {
        var value = this.options[key];
        return D.isFunction(value) ? value.call(this) : value;
    },

    error: function(message) {
        var msg;
        if (!D.isString(message)) throw message;

        msg = this.module ? ['[', this.module.name, ':'] : ['['];
        msg = msg.concat([this.name, '] ', message]);
        throw new Error(msg.join(''));
    },

    mixin: function(mixins) {
        if (!mixins) return;

        mapObj(mixins, function(value, key) {
            var old, me = this;
            if (D.isFunction(value)) {
                old = this[key];
                this[key] = function() {
                    var args = slice.call(arguments);
                    if (old) args.unshift(old);
                    return value.apply(me, args);
                };
            } else {
                if (!this[key]) this[key] = value;
            }
        }, this);
    }
});
