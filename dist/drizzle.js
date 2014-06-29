// DrizzleJS v0.2.0
// -------------------------------------
// Copyright (c) 2014 Jaco Koo <jaco.koo@guyong.in>
// Distributed under MIT license

var __slice = [].slice;

(function(root, factory) {
  var $;
  if (typeof define === 'function' && define.amd) {
    return define(['jquery'], function($) {
      return factory(root, $);
    });
  } else if (module && module.exports) {
    $ = require('jquery');
    return module.exports = factory(root, $);
  } else {
    return root.Drizzle = factory(root, $);
  }
})(this, function(root, $) {
  var Drizzle, getOptionValue, idCounter, include, item, noConflict, previousDrizzle, uniqueId, _fn, _i, _len, _ref;
  Drizzle = {
    version: '0.2.0'
  };
  previousDrizzle = root.Drizzle;
  idCounter = 0;
  _ref = ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'];
  _fn = function(item) {
    return Drizzle["is" + item] = function(obj) {
      return Object.prototype.toString.call(obj) === ("[object " + item + "]");
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    _fn(item);
  }
  Drizzle.extend = function() {
    var key, mixin, mixins, target, value, _j, _len1;
    target = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!Drizzle.isObject(target)) {
      return target;
    }
    for (_j = 0, _len1 = mixins.length; _j < _len1; _j++) {
      mixin = mixins[_j];
      for (key in mixin) {
        value = mixin[key];
        target[key] = value;
      }
    }
    return target;
  };
  Drizzle.extend(Drizzle, getOptionValue = function(thisObj, options, key) {
    var value;
    if (!options) {
      return null;
    }
    value = key ? options[key] : options;
    if (Drizzle.isFunction(value)) {
      return value.apply(thisObj);
    } else {
      return value;
    }
  }, uniqueId = function(prefix) {
    return (prefix ? prefix : '') + ++i;
  }, include = function() {
    var clazz, key, mixin, mixins, value, _j, _len1;
    clazz = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_j = 0, _len1 = mixins.length; _j < _len1; _j++) {
      mixin = mixins[_j];
      for (key in mixin) {
        value = mixin[key];
        clazz.prototype[key] = value;
      }
    }
    return clazz;
  }, noConflict = function() {
    root.Drizzle = previousDrizzle;
    return Drizzle;
  });
  Drizzle.Config = {
    scriptRoot: 'app',
    urlRoot: '',
    urlSuffix: '',
    attributesReferToId: ['for', 'data-target', 'data-parent'],
    fileNames: {
      module: 'index',
      templates: 'templates',
      view: 'view-',
      template: 'template-',
      handler: 'handler-',
      model: 'model-',
      collection: 'collection-',
      router: 'router'
    }
  };
  Drizzle.Deferred = {
    createDeferred: function() {
      return $.Deferred();
    },
    deferred: function() {
      var args, fn, obj;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (Drizzle.isFunction(fn)) {
        fn = fn.apply(this, args);
      }
      if (fn != null ? fn.promise : void 0) {
        return fn.promise();
      }
      obj = this.createDeferred();
      obj.resolve(fn);
      return obj.promise();
    },
    chain: function() {
      var doItem, gots, obj, rings;
      rings = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      obj = this.createDeferred();
      if (rings.length === 0) {
        obj.resolve();
        return obj.promise();
      }
      gots = [];
      doItem = (function(_this) {
        return function(item, i) {
          var args, gotResult, inArray, promises;
          gotResult = function(data) {
            if (!Drizzle.isArray(item) && data.length < 2) {
              data = data[0];
            }
            return gots.push(data);
          };
          return (Drizzle.isArray(item) ? (promises = (function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = item.length; _j < _len1; _j++) {
              inArray = item[_j];
              args = [inArray];
              if (i > 0) {
                args.push(gots[i - 1]);
              }
              _results.push(this.deferred.apply(this, args));
            }
            return _results;
          }).call(_this), $.when.apply($, promises)) : (args = [item], i > 0 ? args.push(gots[i - 1]) : void 0, _this.deferred.apply(_this, args))).done(function() {
            var data;
            data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            gotResult(data);
            if (rings.length === 0) {
              return obj.resolve.apply(obj, gots);
            } else {
              return doItem(rings.shift(), ++i);
            }
          }).fail(function() {
            var data;
            data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            gotResult(data);
            return obj.reject.apply(obj, gots);
          });
        };
      })(this);
      doItem(rings.shift(), 0);
      return obj.promise();
    }
  };
  return Drizzle;
});

//# sourceMappingURL=drizzle.js.map
