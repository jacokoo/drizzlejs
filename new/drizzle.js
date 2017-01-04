const D = {};

const isFunction = (fun) => typeof fun === 'function';

const isObject = (obj) => obj && typeof obj === 'object';

const isArray = (arr) => Array.isArray(arr);

const isString = (str) => typeof str === 'string';

const map = (arr, fn) => Array.isArray(arr) ? arr.map(fn) : [];

const mapObj = (obj, fn) => {
    const result = {};
    Object.keys(obj || {}).forEach(k => result[k] = fn(obj[key], k));
    return result;
};

const clone = (target) => {
    if (isObject(target)) {
        return mapObj(target, value => clone(value));
    }

    if (isArray(target)) {
        return map(target, value => clone(value));
    }

    return target;
};

const assign = (target, ...arg) => {
    const result = target || {};
    result && map(args, arg => arg && mapObj(arg, (v, k) => result[k] = v));
    return result;
};

let conter = 0;

assign(D, {

    uniqueId (prefix = '') {
        return `${prefix}${++counter}`;
    }

});
