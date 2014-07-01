// DrizzleJS v0.2.0
// -------------------------------------
// Copyright (c) 2014 Jaco Koo <jaco.koo@guyong.in>
// Distributed under MIT license

var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  var Base, D, Data, Drizzle, idCounter, item, noConflict, previousDrizzle, uniqueId, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1;
  D = Drizzle = {
    version: '0.2.0'
  };
  previousDrizzle = root.Drizzle;
  idCounter = 0;
  _ref = ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'];
  _fn = function(item) {
    return D["is" + item] = function(obj) {
      return Object.prototype.toString.call(obj) === ("[object " + item + "]");
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    _fn(item);
  }
  D.extend = function() {
    var key, mixin, mixins, target, value, _j, _len1;
    target = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!D.isObject(target)) {
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
  D.extend(D, uniqueId = function(prefix) {
    return (prefix ? prefix : '') + ++i;
  }, noConflict = function() {
    root.Drizzle = previousDrizzle;
    return D;
  });
  Drizzle.Base = Base = (function() {
    Base.include = function() {
      var key, mixin, mixins, value, _j, _len1;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_j = 0, _len1 = mixins.length; _j < _len1; _j++) {
        mixin = mixins[_j];
        for (key in mixin) {
          value = mixin[key];
          this.prototype[key] = value;
        }
      }
      return this;
    };

    Base.include(Drizzle.Deferred);

    function Base(idPrefix) {
      this.id = Drizzle.uniqueId(idPrefix);
      this.initialize();
    }

    Base.prototype.initialize = function() {};

    Base.prototype.getOptionResult = function(value) {
      if (_.isFunction(value)) {
        return value.apply(this);
      } else {
        return value;
      }
    };

    Base.prototype.extend = function(mixins) {
      var doExtend, key, value, _results;
      if (!mixins) {
        return;
      }
      doExtend = (function(_this) {
        return function(key, value) {
          var old;
          if (Drizzle.isFunction(value)) {
            old = _this[key];
            return _this[key] = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              if (old) {
                args.unshift(old);
              }
              return value.apply(this, args);
            };
          } else {
            if (!_this[key]) {
              return _this[key] = value;
            }
          }
        };
      })(this);
      _results = [];
      for (key in mixins) {
        value = mixins[key];
        _results.push(doExtend(key, value));
      }
      return _results;
    };

    return Base;

  })();
  D.Model = Data = (function(_super) {
    __extends(Data, _super);

    function Data(app, module, options) {
      var defaults, p;
      this.app = app;
      this.module = module;
      this.options = options != null ? options : {};
      this.data = this.options.data || {};
      this.params = {};
      if (options.pageable) {
        defaults = D.Config.pagination;
        p = this.pagination = {
          page: options.page || 1,
          pageCount: 0,
          pageSize: options.pageSize || defaults.pageSize,
          pageKey: options.pageKey || defaults.pageKey,
          pageSizeKey: options.pageSizeKey || defaults.pageSizeKey,
          recordCountKey: options.recordCountKey || defaults.recordCountKey
        };
      }
      Data.__super__.constructor.call(this, 'd');
    }

    Data.prototype.setData = function(data) {
      var p;
      this.data = D.isFunction(this.options.parse) ? this.options.parse(data) : data;
      if (p = this.pagination) {
        p.recordCount = this.data[p.recordCountKey];
        p.pageCount = Math.ceil(p.recordCount / p.pageSize);
      }
      if (this.options.root) {
        return this.data = this.data[this.options.root];
      }
    };

    Data.prototype.url = function() {
      return this.getOptionResult(this.options.url) || this.getOptionResult(this.url) || '';
    };

    Data.prototype.toJSON = function() {
      return this.data;
    };

    Data.prototype.getParams = function() {
      var d, p;
      d = {};
      if (p = this.pagination) {
        d[p.pageKey] = p.page;
        d[p.pageSizeKey] = p.pageSize;
      }
      return D.extend(d, this.params, this.options.params);
    };

    Data.prototype.clear = function() {
      var p;
      this.data = {};
      if (p = this.pagination) {
        p.page = 1;
        return p.pageCount = 0;
      }
    };

    Data.prototype.turnToPage = function(page, options) {
      var p;
      if (!(p = this.pagination && page <= p.pageCount && page >= 1)) {
        return this.createRejectedDeferred();
      }
      p.page = page;
      return this.get(options);
    };

    Data.prototype.firstPage = function(options) {
      return this.turnToPage(1, options);
    };

    Data.prototype.lastPage = function(options) {
      return this.turnToPage(this.pagination.pageCount, options);
    };

    Data.prototype.nextPage = function(options) {
      return this.turnToPage(this.pagination.page + 1, options);
    };

    Data.prototype.prevPage = function(options) {
      return this.turnToPage(this.pagination.page - 1, options);
    };

    Data.prototype.getPageInfo = function() {
      var d, p;
      if (!(p = this.pagination)) {
        return {};
      }
      d = this.data.length > 0 ? {
        start: (p.page - 1) * p.pageSize + 1,
        end: p.page * p.pageSize,
        total: p.recordCount
      } : {
        start: 0,
        end: 0,
        total: 0
      };
      if (d.end > d.total) {
        d.end = d.total;
      }
      return d;
    };

    return Data;

  })(D.Base);
  _ref1 = ['get', 'post', 'put', 'del'];
  _fn1 = function(item) {};
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    item = _ref1[_j];
    _fn1(item);
    D.Model.prototype[item] = function(options) {
      return D.Require[item](this, options);
    };
  }
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
    },
    pagination: {
      defaultPageSize: 10,
      pageKey: '_page',
      pageSizeKey: '_pageSize',
      recordCountKey: 'recordCount'
    }
  };
  D.Deferred = {
    createDeferred: function() {
      return $.Deferred();
    },
    createRejectedDeferred: function() {
      var args, d;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      d = this.createDeferred();
      d.reject.apply(d, args);
      return d;
    },
    deferred: function() {
      var args, fn, obj;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (D.isFunction(fn)) {
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
            if (!D.isArray(item) && data.length < 2) {
              data = data[0];
            }
            return gots.push(data);
          };
          return (D.isArray(item) ? (promises = (function() {
            var _k, _len2, _results;
            _results = [];
            for (_k = 0, _len2 = item.length; _k < _len2; _k++) {
              inArray = item[_k];
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
  D.Event = {
    on: function(name, callback, context) {
      var _base;
      this.registeredEvents || (this.registeredEvents = {});
      ((_base = this.registeredEvents)[name] || (_base[name] = [])).push({
        fn: callback,
        context: context
      });
      return this;
    },
    off: function(name, callback, context) {
      var events;
      if (!(this.registeredEvents && (events = this.registeredEvents[name]))) {
        return this;
      }
      this.registeredEvents[name] = (function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
          item = events[_k];
          if (item.fn !== callback || (context && context !== item.context)) {
            _results.push(item);
          }
        }
        return _results;
      })();
      return this;
    },
    trigger: function() {
      var args, events, name, _k, _len2;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!(this.registeredEvents && (events = this.registeredEvents[name]))) {
        return this;
      }
      for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
        item = events[_k];
        item.fn.apply(item.context, args);
      }
      return this;
    },
    listenTo: function(obj, name, callback) {
      var _base;
      this.registeredListeners || (this.registeredListeners = {});
      ((_base = this.registeredListeners)[name] || (_base[name] = [])).push({
        fn: callback,
        obj: obj
      });
      obj.on(name, callback, this);
      return this;
    },
    stopListening: function(obj, name, callback) {
      var key, value, _k, _len2, _ref2, _ref3;
      if (!this.registeredListeners) {
        return this;
      }
      if (!obj) {
        _ref2 = this.registeredListeners;
        for (key in _ref2) {
          value = _ref2[key];
          value.obj.off(key, value.fn, this);
        }
        return this;
      }
      _ref3 = this.registeredListeners;
      for (key in _ref3) {
        value = _ref3[key];
        if (name && name !== key) {
          continue;
        }
        this.registeredListeners[key] = [];
        for (_k = 0, _len2 = value.length; _k < _len2; _k++) {
          item = value[_k];
          if (item.obj !== obj || (callback && callback !== item.fn)) {
            this.registeredListeners[key].push(item);
          } else {
            item.obj.off(key, item.fn, this);
          }
        }
      }
      return this;
    }
  };
  D.Request = {
    url: function(model) {
      var base, urls;
      urls = [D.Config.urlRoot];
      if (model.module.options.urlPrefix) {
        url.push(model.module.options.urlPrefix);
      }
      url.push(model.module.name);
      base = model.url || '';
      if (D.isFunction(base)) {
        base = base.apply(model);
      }
      while (base.indexOf('../') === 0) {
        paths.pop();
        base = base.slice(3);
      }
      urls.push(base);
      if (model.data.id) {
        urls.push(model.data.id);
      }
      return urls.join('/').replace(/\/{2, }/g, '/');
    },
    get: function(model, options) {
      return this.ajax({
        type: 'GET'
      }, model, model.getParams(), options);
    },
    post: function(model, options) {
      return this.ajax({
        type: 'POST'
      }, model, model.data, options);
    },
    put: function(model, options) {
      return this.ajax({
        type: 'PUT'
      }, model, model.data, options);
    },
    del: function(model, options) {
      return this.ajax({
        type: 'DELETE'
      }, model, model.data, options);
    },
    ajax: function(params, model, data, options) {
      var url;
      url = this.url(model);
      params = D.extend(params, {
        contentType: 'application/json'
      }, options);
      data = D.extend(data, options.data);
      params.url = url;
      params.data = data;
      return D.Deferred.chain($.ajax(params), function(resp) {
        return model.setData(resp);
      });
    }
  };
  return Drizzle;
});

//# sourceMappingURL=drizzle.js.map
