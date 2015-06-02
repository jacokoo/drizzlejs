/*!
 * DrizzleJS v0.3.6
 * -------------------------------------
 * Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */

'use strict';

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory;
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.jQueryAdapter = factory;
    }
})(window, function(root, $, D) {
    var slice = [].slice,

    Promise = function(fn) {
        var me = this;
        /*eslint-disable*/
        this.deferred = $.Deferred();
        /*eslint-enable*/

        fn($.proxy(me.deferred.resolve, me.deferred), $.proxy(me.deferred.reject, me.deferred));
    };

    D.assign(Promise, {
        resolve: function(data) {
            if (data && data.promise) return data.promise();
            return new Promise(function(resolve) { resolve(data); });
        },

        reject: function(data) {
            if (data && data.promise) return data.promise();
            return new Promise(function(r, reject) { reject(data); });
        },

        all: function(args) {
            return new Promise(function(resolve, reject) {
                $.when.apply($, args).then(function() {
                    resolve(slice.call(arguments));
                }, function() {
                    reject(slice.call(arguments));
                });
            });
        }
    });

    D.assign(Promise.prototype, {
        then: function() { return this.deferred.then.apply(this.deferred, arguments); },

        promise: function() { return this.deferred.promise(); },

        'catch': function(fn) { return this.deferred.fail(fn); }
    });

    D.assign(D.Adapter, {
        Promise: root.Promise || Promise,
        ajax: $.ajax,
        hasClass: function(el, name) { return $(el).hasClass(name); },
        addClass: function(el, name) { return $(el).addClass(name); },
        removeClass: function(el, name) { return $(el).removeClass(name); },
        delegateDomEvent: function(el, name, selector, fn) {
            $(el).on(name, selector, fn);
        },
        undelegateDomEvents: function(el, namespace) {
            $(el).off(namespace);
        },
        getFormData: function(form) {
            var data = {};
            $.each($(form).serializeArray(), function(i, item) {
                var o = data[item.name];
                if (o === undefined) {
                    data[item.name] = item.value;
                } else {
                    if (!D.isArray(o)) {
                        o = data[item.name] = [data[item.name]];
                    }
                    o.push(item.value);
                }
            });
            return data;
        }
    });
});
