(function() {
    'use strict';
    var define, flat, modules = {}, require, toString = Object.prototype.toString.call;

    flat = function(name, ctx) {
        var n, names, paths;
        if (name[0] !== '.') {
            return name;
        }
        names = name.split('/');
        paths = ctx.split('/');
        paths.pop();
        while (names[0][0] === '.') {
            n = names.shift();
            if (n === '..') {
                paths.pop();
            }
        }
        return paths.concat(names).join('/');
    };

    define = function(name, deps, obj) {
        var a;
        if (toString(deps) !== '[object Array]') {
            obj = deps;
            deps = [];
        }
        if (toString(obj) !== '[object Function]') {
            a = obj;
            obj = function() {
                return a;
            };
        }
        modules[name] = {
            args: [deps, obj],
            inited: false
        };
    };

    require = function(deps, obj, ctx) {
        var array, ms, name, o, i;
        array = true;
        if (toString(deps) === '[object String]') {
            deps = [deps];
            array = false;
        }
        if (!obj) {
            obj = function() {
                var args = Array.prototype.slice.call(arguments);
                if (array) {
                    return args;
                }
                return args[0];
            };
        }
        if (deps.length === 0) {
            return obj();
        }
        ms = [];
        for (i = 0; i < deps.length; i ++) {
            name = flat(deps[i], ctx);
            o = modules[name];
            if (!o) throw new Error('Module [' + o + '] is not defined')
            if (o.inited) {
                ms.push(o.result);
            } else {
                o.result = require.apply(null, o.args.concat(name));
                o.inited = true;
                ms.push(o.result);
            }
        }
        return obj.apply(window, ms);
    };

    define.amd = true;

    require.config = function(obj) {
        var k, v;
        if (!obj.shim) {
            return;
        }
        for (k in obj.shim) {
            v = obj.shim[k];
            if (v.exports) {
                modules[k] = {inited: true, result: window[v.exports]};
            }
        }
    };

    modules.require = {
        result: require,
        inited: true
    };

    modules.module = {
        result: {},
        inited: true
    };

    modules.exports = {
        result: window,
        inited: true
    };

    this.define = define;
    this.require = require;

}).call(this);
