const Drizzle = {},
    D = Drizzle,
    slice = [].slice,
    EMPTY = function() {},

    map = function(arr, fn) {
        const result = [];
        if (!arr) return result;
        if (arr.map) return arr.map(fn);

        for (let i = 0; i < arr.length; i ++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },

    mapObj = function(obj, fn) {
        const result = [];
        let key;
        if (!obj) return result;

        for (key in obj) {
            if (D.hasOwnProperty.call(obj, key)) result.push(fn(obj[key], key, obj));
        }

        return result;
    },

    clone = function(target) {
        if (D.isObject(target)) {
            const result = {};
            mapObj(target, function(value, key) {
                result[key] = clone(value);
            });
            return result;
        }

        if (D.isArray(target)) {
            return map(target, function(value) {
                return clone(value);
            });
        }

        return target;
    },

    typeCache = {
        View: {}, Region: {}, Module: {}, Model: {},

        register (type, name, clazz) {
            this[type][name] = clazz;
        },

        create (type, name, ...args) {
            const Clazz = this[type][name] || D[type];
            return new Clazz(...args);
        }
    };

let counter = 0;

map(['Function', 'Array', 'String', 'Object'], (item) => {
    D[`is${item}`] = function(obj) {
        return D.toString.call(obj) === `[object ${item}]`;
    };
});

map(['Module', 'View', 'Region', 'Model', 'Store'], (item) => {
    D['register' + item] = (name, clazz) => typeCache.register(item, name, clazz);
    typeCache['create' + item] = (name, ...args) => typeCache.create(item, name, ...args);
});

Object.assign(D, {
    uniqueId (prefix = '') {
        return `${prefix}${++counter}`;
    },

    adapt (obj) {
        Object.assign(D.Adapter, obj);
    }
});

// @include util/adapter.js
// @include util/promise.js
// @include util/event.js
// @include util/request.js
// @include util/component-manager.js
// @include core/base.js
// @include core/renderable.js
// @include core/renderable-container.js
// @include core/action-creator.js
// @include core/view.js
// @include core/module.js
// @include core/region.js
// @include core/template-engine.js
// @include core/store.js
// @include core/model.js
// @include core/loader.js
// @include core/application.js
// @include core/router.js
