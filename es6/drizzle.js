let Drizzle = {},
    D = Drizzle,
    slice = [].slice,
    EMPTY = function() {},
    counter = 0,

    map = function(arr, fn) {
        let result = [];
        if (!arr) return result;

        if (arr.map) return arr.map(fn);

        for (let i = 0; i < arr.length; i ++) {
            result.push(fn(arr[i], i, arr));
        }

        return result;
    },

    mapObj = function(obj, fn) {
        let result = [], key;
        if (!obj) return result;

        for (key in obj) {
            if (D.hasOwnProperty.call(obj, key)) result.push(fn(obj[key], key, obj));
        }

        return result;
    },

    typeCache = {
        View: {}, Region: {}, Module: {}, Model: {},

        register (type, name, clazz) {
            this[type][name] = clazz;
        },

        create (type, name, ...args) {
            let clazz = this[type][name] || D[type];
            return new clazz(...args);
        }
    };

map(['Function', 'Array', 'String', 'Object'], (item) => {
    D[`is${item}`] = function(obj) {
        return D.toString.call(obj) === `[object ${item}]`;
    }
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
