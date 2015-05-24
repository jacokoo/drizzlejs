'use strict';

(function(root, factory) {
    var handlebars;

    if (typeof define === 'function' && define.amd) {
        define(['handlebars.runtime'], function(Handlebars) {
            return factory(root, Handlebars['default']);
        });
    } else if (module && module.exports) {
        handlebars = require('handlebars/runtime')['default'];
        module.exports = factory(root, handlebars);
    } else {
        root.Drizzle = factory(root, root.Handlebars);
    }
})(window, function(root, handlebars) {
    var Drizzle = {}, D = Drizzle, A,
        counter = 0,
        toString = Drizzle.toString,
        has = Drizzle.hasOwnProperty,
        slice = [].slice,
        FN = function() {},

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

    compose = function() {
        return slice.call(arguments).join('/').replace(/\/{2,}/g, '/')
            .replace(/^\/|\/$/g, '');
    };

    map(['Function', 'Array', 'String', 'Object'], function(value) {
        Drizzle['is' + value] = function(obj) {
            return toString.call(obj) === '[object ' + value + ']';
        };
    });

    Drizzle.uniqueId = function(prefix) {
        return (prefix || '') + (++counter);
    };

    Drizzle.assign = function(target) {
        if (!target) return target;
        map(slice.call(arguments, 1), function(arg) {
            if (!arg) return;
            mapObj(arg, function(value, key) {
                target[key] = value;
            });
        });
        return target;
    };

    Drizzle.extend = function(child, parent, obj) {
        mapObj(parent, function(value, key) {
            if (has.call(parent, key)) child[key] = value;
        });

        function Ctor() { this.constructor = child; }
        Ctor.prototype = parent.prototype;
        child.prototype = new Ctor();
        child.__super__ = parent.prototype;

        mapObj(obj, function(value, key) {
            child.prototype[key] = value;
        });

        return child;
    };

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
