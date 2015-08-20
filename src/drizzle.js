'use strict';

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['handlebars.runtime'], function(Handlebars) {
            return factory(root, Handlebars['default']);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root, require('handlebars/runtime')['default']);
    } else {
        root.Drizzle = factory(root, root.Handlebars);
    }
})(window, function(root, handlebars) {
    var Drizzle = {}, D = Drizzle,
        counter = 0,
        toString = Drizzle.toString,
        has = Drizzle.hasOwnProperty,
        slice = [].slice,
        FN = function() {},

    chain = function(obj) {
        return obj.Promise.chain.apply(obj.Promise, slice.call(arguments, 1));
    },

    parent = function(obj) {
        return obj.__super__.constructor;
    },

    mapObj = function(obj, fn, ctx) {
        var result = [], i;
        if (!obj) return result;

        for (i in obj) {
            if (has.call(obj, i)) result.push(fn.call(ctx, obj[i], i));
        }
        return result;
    },

    map = function(arr, fn, ctx) {
        var result = [], i;
        if (!arr) return result;
        if (arr.map) return arr.map(fn, ctx);

        for (i = 0; i < arr.length; i++) {
            result.push(fn.call(ctx, arr[i], i));
        }
        return result;
    },

    assign = function(target) {
        if (!target) return target;
        map(slice.call(arguments, 1), function(arg) {
            if (!arg) return;
            mapObj(arg, function(value, key) {
                target[key] = value;
            });
        });
        return target;
    },

    extend = function(child, theParent, obj) {
        mapObj(theParent, function(value, key) {
            if (has.call(theParent, key)) child[key] = value;
        });

        function Ctor() { this.constructor = child; }
        Ctor.prototype = theParent.prototype;
        child.prototype = new Ctor();
        child.__super__ = theParent.prototype;

        mapObj(obj, function(value, key) {
            child.prototype[key] = value;
        });

        return child;
    },

    compose = function() {
        return slice.call(arguments).join('/').replace(/\/{2,}/g, '/')
            .replace(/^\/|\/$/g, '');
    },

    clone = function(target) {
        var result;
        if (D.isObject(target)) {
            result = {};
            mapObj(target, function(value, key) {
                result[key] = clone(value);
            });
            return result;
        }

        if (D.isArray(target)) {
            return map(target, function(value) {
                return clone(value);
            });
        };

        return target;
    },

    Application, Base, Loader, Model, Module, MultiRegion,
    PageableModel, Region, Router, View, Layout, Adapter,
    Event, Factory, Helpers, Request, Promise, SimpleLoader;

    map(['Function', 'Array', 'String', 'Object'], function(value) {
        Drizzle['is' + value] = function(obj) {
            return toString.call(obj) === '[object ' + value + ']';
        };
    });

    Drizzle.uniqueId = function(prefix) {
        return (prefix || '') + (++counter);
    };

    Drizzle.assign = assign;

    Drizzle.extend = extend;

    // @include util/adapter.js

    // @include util/promise.js

    // @include util/event.js

    // @include util/request.js

    // @include util/factory.js

    // @include core/base.js

    // @include core/application.js

    // @include core/model.js

    // @include core/region.js

    // @include core/view.js

    // @include core/module.js

    // @include core/loader.js

    // @include core/router.js

    // @include util/helpers.js

    // @include core/pageable-model.js

    // @include core/multi-region.js

    return Drizzle;
});
