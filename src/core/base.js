Base = D.Base = function(idPrefix, options) {
    this.options = options || {};
    this.id = D.uniqueId(idPrefix);
    this.Promise = new Promise(this);
    this.initialize();
};

assign(Base.prototype, {
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
        var me = this;
        if (!mixins) return;
        mapObj(mixins, function(value, key) {
            var old;
            if (D.isFunction(value)) {
                old = me[key];
                me[key] = function() {
                    var args = slice.call(arguments);
                    if (old) args.unshift(old);
                    return value.apply(me, args);
                };
            } else {
                if (!me[key]) me[key] = value;
            }
        });
    }
});
