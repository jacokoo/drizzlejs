
/*!
 * DrizzleJS v0.3.3
 * -------------------------------------
 * Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */
var slice = [].slice;

(function(root, factory) {
  var $, D;
  if (typeof define === 'function' && define.amd) {
    return define(['jquery', 'drizzlejs'], function($, D) {
      return factory(root, $, D);
    });
  } else if (module && module.exports) {
    $ = require('jquery');
    D = require('drizzlejs');
    return factory(root, $, D);
  } else {
    return factory(root, $, Drizzle);
  }
})(window, function(root, $, D) {
  var Promise;
  Promise = (function() {
    Promise.resolve = function(data) {
      if (data && data.promise) {
        return data.promise();
      }
      return new Promise(function(resolve) {
        return resolve(data);
      });
    };

    Promise.reject = function(data) {
      if (data && data.promise) {
        return data.promise();
      }
      return new Promise(function(resolve, reject) {
        return reject(data);
      });
    };

    Promise.all = function(args) {
      return new Promise(function(re, rj) {
        return $.when.apply($, args).then(function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return re(args);
        }, function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return rj(args);
        });
      });
    };

    function Promise(fn) {
      this.deferred = $.Deferred();
      setTimeout((function(_this) {
        return function() {
          return fn($.proxy(_this.deferred.resolve, _this.deferred), $.proxy(_this.deferred.reject, _this.deferred));
        };
      })(this), 1);
    }

    Promise.prototype.then = function() {
      var args, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = this.deferred).then.apply(ref, args);
    };

    Promise.prototype.promise = function() {
      return this.deferred.promise();
    };

    Promise.prototype["catch"] = function(fn) {
      return this.deferred.fail(fn);
    };

    return Promise;

  })();
  return D.extend(D.Adapter, {
    ajax: $.ajax,
    hasClass: function(el, clazz) {
      return $(el).hasClass(clazz);
    },
    addClass: function(el, clazz) {
      return $(el).addClass(clazz);
    },
    removeClass: function(el, clazz) {
      return $(el).removeClass(clazz);
    },
    componentHandler: function(name) {
      return {
        creator: function(view, el, options) {
          if (!el[name]) {
            throw new Error('Component [' + name + '] is not defined');
          }
          return el[name](options);
        },
        destructor: function(view, component, info) {
          return component[name]('destroy');
        }
      };
    },
    delegateDomEvent: function(el, name, selector, fn) {
      return $(el).on(name, selector, fn);
    },
    undelegateDomEvents: function(el, namespace) {
      return $(el).off(namespace);
    },
    getFormData: function(form) {
      var data, i, item, len, o, ref;
      data = {};
      ref = $(form).serializeArray();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        o = data[item.name];
        if (o === void 0) {
          data[item.name] = item.value;
        } else {
          if (!D.isArray(o)) {
            o = data[item.name] = [data[item.name]];
          }
          o.push(data.value);
        }
      }
      return data;
    },
    Promise: root.Promise || Promise
  });
});

//# sourceMappingURL=jquery-adapter.js.map