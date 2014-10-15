// DrizzleJS v0.2.4
// -------------------------------------
// Copyright (c) 2014 Jaco Koo <jaco.koo@guyong.in>
// Distributed under MIT license

var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(root, factory) {
  var $, Handlebars;
  if (typeof define === 'function' && define.amd) {
    return define(['jquery', 'handlebars'], function($, Handlebars) {
      return factory(root, $, Handlebars);
    });
  } else if (module && module.exports) {
    $ = require('jquery');
    Handlebars = require('handlebars');
    return module.exports = factory(root, $, Handlebars);
  } else {
    return root.Drizzle = factory(root, $);
  }
})(this, function(root, $, Handlebars) {
  var Application, Base, D, DefaultConfigs, Drizzle, Layout, Loader, Model, Module, ModuleContainer, MultiRegion, Region, Route, Router, SimpleLoader, View, idCounter, item, oldReference, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1;
  D = Drizzle = {
    version: '0.2.4'
  };
  oldReference = root.Drizzle;
  idCounter = 0;
  _ref = ['Function', 'Object', 'String', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'];
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
  D.extend(D, {
    uniqueId: function(prefix) {
      return (prefix ? prefix : '') + ++idCounter;
    },
    noConflict: function() {
      root.Drizzle = oldReferrence;
      return D;
    },
    joinPath: function() {
      var paths;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return paths.join('/').replace(/\/+/g, '/');
    }
  });
  D.Deferred = {
    createDeferred: function() {
      D.deferredCount || (D.deferredCount = 1);
      D.deferredCount++;
      return $.Deferred();
    },
    createRejectedDeferred: function() {
      var args, d;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      d = this.createDeferred();
      d.reject.apply(d, args);
      return d;
    },
    createResolvedDeferred: function() {
      var args, d;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      d = this.createDeferred();
      d.resolve.apply(d, args);
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
              return obj.resolve(gots[gots.length - 1]);
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
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
          item = events[_j];
          if (item.fn !== callback || (context && context !== item.context)) {
            _results.push(item);
          }
        }
        return _results;
      })();
      if (this.registeredEvents[name].length === 0) {
        delete this.registeredEvents[name];
      }
      return this;
    },
    trigger: function() {
      var args, events, name, _j, _len1;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!(this.registeredEvents && (events = this.registeredEvents[name]))) {
        return this;
      }
      for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
        item = events[_j];
        item.fn.apply(item.context, args);
      }
      return this;
    },
    delegateEvent: function(target) {
      return D.extend(target, {
        on: (function(_this) {
          return function(name, callback, context) {
            target.listenTo(_this, "" + name + "." + target.id, callback, context);
            return target;
          };
        })(this),
        off: (function(_this) {
          return function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (args.length > 0) {
              args.unshift("" + (args.shift()) + "." + target.id);
            }
            args.unshift(_this);
            target.stopListening.apply(target, args);
            return target;
          };
        })(this),
        trigger: (function(_this) {
          return function() {
            var args, name;
            name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            args.unshift("" + name + "." + target.id);
            _this.trigger.apply(_this, args);
            return target;
          };
        })(this),
        listenTo: function(obj, name, callback, context) {
          var ctx, _base;
          ctx = context || this;
          this.registeredListeners || (this.registeredListeners = {});
          ((_base = this.registeredListeners)[name] || (_base[name] = [])).push({
            fn: callback,
            obj: obj,
            context: ctx
          });
          obj.on(name, callback, ctx);
          return this;
        },
        stopListening: function(obj, name, callback) {
          var key, value, _j, _k, _len1, _len2, _ref1, _ref2;
          if (!this.registeredListeners) {
            return this;
          }
          if (!obj) {
            _ref1 = this.registeredListeners;
            for (key in _ref1) {
              value = _ref1[key];
              for (_j = 0, _len1 = value.length; _j < _len1; _j++) {
                item = value[_j];
                item.obj.off(key, item.fn, this);
              }
            }
            this.registeredListeners = {};
            return this;
          }
          _ref2 = this.registeredListeners;
          for (key in _ref2) {
            value = _ref2[key];
            if (name && name !== key) {
              continue;
            }
            this.registeredListeners[key] = [];
            for (_k = 0, _len2 = value.length; _k < _len2; _k++) {
              item = value[_k];
              if (item.obj !== obj || (callback && callback !== item.fn)) {
                this.registeredListeners[key].push(item);
              } else {
                item.obj.off(key, item.fn, item.context);
              }
            }
            if (this.registeredListeners[key].length === 0) {
              delete this.registeredListeners[key];
            }
          }
          return this;
        }
      });
    }
  };
  D.Request = {
    url: function(model) {
      var base, options, urls;
      options = model.app.options;
      urls = [options.urlRoot];
      if (model.module.options.urlPrefix) {
        urls.push(model.module.options.urlPrefix);
      }
      urls.push(model.module.name);
      base = model.url || '';
      if (D.isFunction(base)) {
        base = base.apply(model);
      }
      while (base.indexOf('../') === 0) {
        paths.pop();
        base = base.slice(3);
      }
      if (base) {
        urls.push(base);
      }
      if (model.data.id) {
        urls.push(model.data.id);
      }
      if (options.urlSuffix) {
        urls.push(urls.pop() + options.urlSuffix);
      }
      return D.joinPath.apply(D, urls);
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
      if (options == null) {
        options = {};
      }
      url = this.url(model);
      params = D.extend(params, {
        contentType: model.app.options.defaultContentType
      }, options);
      data = D.extend(data, options.data);
      params.url = url;
      params.data = data;
      return model.chain($.ajax(params), function(_arg) {
        var resp;
        resp = _arg[0];
        return model.set(resp);
      });
    }
  };
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
      if (D.isFunction(value)) {
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
  DefaultConfigs = {
    scriptRoot: 'app',
    urlRoot: '',
    urlSuffix: '',
    defaultContentType: 'application/json',
    caseSensitiveHash: false,
    attributesReferToId: ['for', 'data-target', 'data-parent'],
    fileNames: {
      module: 'index',
      templates: 'templates',
      view: 'view-',
      template: 'template-',
      handler: 'handler-',
      model: 'model-',
      collection: 'collection-',
      router: 'router',
      templateSuffix: '.html'
    },
    pagination: {
      defaultPageSize: 10,
      pageKey: '_page',
      pageSizeKey: '_pageSize',
      recordCountKey: 'recordCount'
    },
    defaultRouter: {
      routes: {
        'module/*name': 'showModule'
      },
      showModule: function(name) {
        return this.app.show(name);
      }
    },
    clickDeferred: function() {}
  };
  D.Application = Application = (function(_super) {
    __extends(Application, _super);

    function Application(options) {
      if (options == null) {
        options = {};
      }
      this.options = D.extend({}, DefaultConfigs, options);
      this.modules = new Module.Container();
      this.global = {};
      this.loaders = {};
      this.regions = [];
      Application.__super__.constructor.call(this, 'a');
      this.modules.delegateEvent(this);
    }

    Application.prototype.initialize = function() {
      var key, value, _ref1;
      this.registerLoader(new D.SimpleLoader(this));
      this.registerLoader(new D.Loader(this), true);
      _ref1 = D.Helpers;
      for (key in _ref1) {
        value = _ref1[key];
        this.registerHelper(key, value);
      }
      return this.setRegion(new D.Region(this, null, $(document.body)));
    };

    Application.prototype.registerLoader = function(loader, isDefault) {
      this.loaders[loader.name] = loader;
      if (isDefault) {
        return this.defaultLoader = loader;
      }
    };

    Application.prototype.registerHelper = function(name, fn) {
      var app;
      app = this;
      return Handlebars.registerHelper(name, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return fn.apply(this, [app, Handlebars].concat(args));
      });
    };

    Application.prototype.getLoader = function(name) {
      var loader;
      loader = Loader.analyse(name).loader;
      if (loader && this.loaders[loader]) {
        return this.loaders[loader];
      } else {
        return this.defaultLoader;
      }
    };

    Application.prototype.setRegion = function(region) {
      this.region = region;
      return this.regions.unshift(this.region);
    };

    Application.prototype.startRoute = function() {
      var defaultPath, paths, _ref1;
      defaultPath = arguments[0], paths = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!this.router) {
        this.router = new D.Router(this);
      }
      return this.chain((_ref1 = this.router).mountRoutes.apply(_ref1, paths), function() {
        return this.router.start(defaultPath);
      });
    };

    Application.prototype.navigate = function(path, trigger) {
      return this.router.navigate(path, trigger);
    };

    Application.prototype.load = function() {
      var name, names;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.chain((function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = names.length; _j < _len1; _j++) {
          name = names[_j];
          _results.push(this.getLoader(name).loadModule(name));
        }
        return _results;
      }).call(this));
    };

    Application.prototype.show = function(feature, options) {
      return this.region.show(feature, options);
    };

    Application.prototype.destory = function() {
      var region;
      return this.chain((function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.regions;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          region = _ref1[_j];
          _results.push(region.close());
        }
        return _results;
      }).call(this));
    };

    Application.prototype.message = {
      success: function(title, content) {
        return alert(content || title);
      },
      info: function(title, content) {
        if (!content) {
          content = title;
        }
        return alert(content || title);
      },
      error: function(title, content) {
        if (!content) {
          content = title;
        }
        return alert(content || title);
      }
    };

    return Application;

  })(D.Base);
  D.Model = Model = (function(_super) {
    __extends(Model, _super);

    function Model(app, module, options) {
      var defaults, p;
      this.app = app;
      this.module = module;
      this.options = options != null ? options : {};
      this.data = this.options.data || {};
      this.params = {};
      if (options.pageable) {
        defaults = this.app.options.pagination;
        p = this.pagination = {
          page: options.page || 1,
          pageCount: 0,
          pageSize: options.pageSize || defaults.defaultPageSize,
          pageKey: options.pageKey || defaults.pageKey,
          pageSizeKey: options.pageSizeKey || defaults.pageSizeKey,
          recordCountKey: options.recordCountKey || defaults.recordCountKey
        };
      }
      Model.__super__.constructor.call(this, 'd');
      this.module.container.delegateEvent(this);
    }

    Model.prototype.set = function(data) {
      var p;
      this.data = D.isFunction(this.options.parse) ? this.options.parse(data) : data;
      if (p = this.pagination) {
        p.recordCount = this.data[p.recordCountKey];
        p.pageCount = Math.ceil(p.recordCount / p.pageSize);
      }
      if (this.options.root) {
        this.data = this.data[this.options.root];
      }
      return this;
    };

    Model.prototype.append = function(data) {
      if (D.isObject(this.data)) {
        D.extend(this.data, data);
      } else if (D.isArray(this.data)) {
        this.data = this.data.concat(D.isArray(data) ? data : [data]);
      }
      return this;
    };

    Model.prototype.find = function(name, value) {
      var _j, _len1, _ref1, _results;
      if (!D.isArray(this.data)) {
        return null;
      }
      _ref1 = this.data;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        if (item[name] === value) {
          _results.push(item);
        }
      }
      return _results;
    };

    Model.prototype.findOne = function(name, value) {
      var _j, _len1, _ref1;
      if (!D.isArray(this.data)) {
        return null;
      }
      _ref1 = this.data;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        if (item[name] === value) {
          return item;
        }
      }
    };

    Model.prototype.url = function() {
      return this.getOptionResult(this.options.url) || '';
    };

    Model.prototype.toJSON = function() {
      return this.data;
    };

    Model.prototype.getParams = function() {
      var d, p;
      d = {};
      if (p = this.pagination) {
        d[p.pageKey] = p.page;
        d[p.pageSizeKey] = p.pageSize;
      }
      return D.extend(d, this.params, this.options.params);
    };

    Model.prototype.clear = function() {
      var p;
      this.data = {};
      if (p = this.pagination) {
        p.page = 1;
        return p.pageCount = 0;
      }
    };

    Model.prototype.turnToPage = function(page, options) {
      var p;
      if (!((p = this.pagination) && page <= p.pageCount && page >= 1)) {
        return this.createRejectedDeferred();
      }
      p.page = page;
      return this.get(options);
    };

    Model.prototype.firstPage = function(options) {
      var p;
      if ((p = this.pagination) && p.page === 1) {
        return this.createRejectedDeferred();
      }
      return this.turnToPage(1, options);
    };

    Model.prototype.lastPage = function(options) {
      var p;
      if ((p = this.pagination) && p.page === p.pageCount) {
        return this.createRejectedDeferred();
      }
      return this.turnToPage(this.pagination.pageCount, options);
    };

    Model.prototype.nextPage = function(options) {
      return this.turnToPage(this.pagination.page + 1, options);
    };

    Model.prototype.prevPage = function(options) {
      return this.turnToPage(this.pagination.page - 1, options);
    };

    Model.prototype.getPageInfo = function() {
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

    return Model;

  })(D.Base);
  _ref1 = ['get', 'post', 'put', 'del'];
  _fn1 = function(item) {
    return D.Model.prototype[item] = function(options) {
      return this.chain(D.Request[item](this, options), function() {
        return this.trigger('sync');
      });
    };
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    item = _ref1[_j];
    _fn1(item);
  }
  D.Region = Region = (function(_super) {
    __extends(Region, _super);

    Region.types = {};

    Region.register = function(name, clazz) {
      return this.types[name] = clazz;
    };

    Region.create = function(type, app, module, el) {
      var clazz;
      clazz = this.types[type] || Region;
      return new clazz(app, module, el);
    };

    function Region(app, module, el) {
      this.app = app;
      this.module = module;
      this.el = el instanceof $ ? el : $(el);
      Region.__super__.constructor.call(this, 'r');
      if (this.el.size() === 0) {
        throw new Error("Can not find DOM element: " + el);
      }
    }

    Region.prototype.getEl = function() {
      return this.el;
    };

    Region.prototype.getCurrentItem = function() {
      return this.currentItem;
    };

    Region.prototype.setCurrentItem = function(item) {
      return this.currentItem = item;
    };

    Region.prototype.show = function(item, options) {
      var cur;
      if (options == null) {
        options = {};
      }
      if (cur = this.getCurrentItem(item, options)) {
        if ((D.isObject(item) && item.id === cur.id) || (D.isString(item) && D.Loader.analyse(item).name === cur.name)) {
          return this.chain(cur.render(options), cur);
        }
      }
      return this.chain((D.isString(item) ? this.app.getLoader(item).loadModule(item) : item), function(item) {
        if (!(item.render && item.setRegion)) {
          throw new Error("Can not show item: " + item);
        }
        return item;
      }, [
        function(item) {
          if (item.region) {
            item.region.close();
          }
          return item;
        }, function() {
          return this.close(cur);
        }
      ], function(_arg) {
        var item;
        item = _arg[0];
        item.setRegion(this);
        this.setCurrentItem(item, options);
        return item;
      }, function(item) {
        return item.render(options);
      });
    };

    Region.prototype.close = function() {
      item = this.currentItem;
      delete this.currentItem;
      return this.chain(function() {
        if (item) {
          return item.close();
        }
      }, this);
    };

    Region.prototype.delegateEvent = function(item, name, selector, fn) {
      var n;
      n = "" + name + ".events" + this.id + item.id;
      if (selector) {
        return this.el.on(n, selector, fn);
      } else {
        return this.el.on(n, fn);
      }
    };

    Region.prototype.undelegateEvents = function(item) {
      return this.el.off(".events" + this.id + item.id);
    };

    Region.prototype.$$ = function(selector) {
      return this.el.find(selector);
    };

    Region.prototype.setHtml = function(html) {
      return this.el.html(html);
    };

    Region.prototype.empty = function() {
      return this.el.empty();
    };

    return Region;

  })(D.Base);
  D.View = View = (function(_super) {
    __extends(View, _super);

    View.ComponentManager = {
      handlers: {},
      register: function(name, creator, destructor, initializer) {
        if (destructor == null) {
          destructor = (function() {});
        }
        if (initializer == null) {
          initializer = (function() {});
        }
        return this.handlers[name] = {
          creator: creator,
          destructor: destructor,
          initializer: initializer,
          initialized: false
        };
      },
      create: function(view, options) {
        var dom, handler, id, name, obj, opt, selector;
        if (options == null) {
          options = {};
        }
        id = options.id, name = options.name, selector = options.selector;
        opt = options.options;
        if (!name) {
          throw new Error('Component name can not be null');
        }
        if (!id) {
          throw new Error('Component id can not be null');
        }
        dom = selector ? view.$$(selector) : id ? view.$(id) : view.getEl();
        handler = this.handlers[name] || {
          creator: function(view, el, options) {
            if (!el[name]) {
              throw new Error("No component handler for name: " + name);
            }
            return el[name](options);
          },
          destructor: function(view, component, info) {
            return component[name]('destroy');
          },
          initialized: true
        };
        obj = !handler.initialized && handler.initializer ? handler.initializer() : null;
        handler.initialized = true;
        return view.chain(obj, handler.creator(view, dom, opt), function(comp) {
          return {
            id: id,
            component: comp,
            info: {
              destructor: handler.destructor,
              options: opt
            }
          };
        });
      },
      destroy: function(view, component, info) {
        return typeof info.destructor === "function" ? info.destructor(view, component, info.options) : void 0;
      }
    };

    function View(name, module, loader, options) {
      this.name = name;
      this.module = module;
      this.loader = loader;
      this.options = options != null ? options : {};
      this.app = this.module.app;
      this.eventHandlers = {};
      View.__super__.constructor.call(this, 'v');
      this.module.container.delegateEvent(this);
    }

    View.prototype.initialize = function() {
      if (this.options.extend) {
        this.extend(this.options.extend);
      }
      return this.loadDeferred = this.chain([this.loadTemplate(), this.loadHandlers()]);
    };

    View.prototype.loadTemplate = function() {
      var template;
      if (this.module.separatedTemplate !== true) {
        return this.chain(this.module.loadDeferred, function() {
          return this.template = this.module.template;
        });
      } else {
        template = this.getOptionResult(this.options.template) || this.name;
        return this.chain(this.app.getLoader(template).loadSeparatedTemplate(this, template), function(t) {
          return this.template = t;
        });
      }
    };

    View.prototype.loadHandlers = function() {
      var handlers;
      handlers = this.getOptionResult(this.options.handlers) || this.name;
      return this.chain(this.app.getLoader(handlers).loadHandlers(this, handlers), function(handlers) {
        return D.extend(this.eventHandlers, handlers);
      });
    };

    View.prototype.bindData = function() {
      return this.module.loadDeferred.done((function(_this) {
        return function() {
          var bind, binding, bindings, doBind, key, value, _results;
          bind = _this.getOptionResult(_this.options.bind) || {};
          _this.data = {};
          doBind = function(model, binding) {
            var event, handler, _ref2;
            _ref2 = binding.split('#'), event = _ref2[0], handler = _ref2[1];
            return _this.listenTo(model, event, function() {
              var args, _base;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              if (!(event && handler)) {
                throw new Error("Incorrect binding string format:" + binding);
              }
              return typeof this[handler] === "function" ? this[handler].apply(this, args) : void 0;
              return typeof (_base = this.eventHandlers)[handler] === "function" ? _base[handler].apply(_base, args) : void 0;
              throw new Error("Can not find handler function for :" + handler);
            });
          };
          _results = [];
          for (key in bind) {
            value = bind[key];
            _this.data[key] = _this.module.data[key];
            if (!_this.data[key]) {
              throw new Error("Model: " + key + " doesn't exists");
            }
            if (!value) {
              continue;
            }
            bindings = value.replace(/\s+/g, '').split(',');
            _results.push((function() {
              var _k, _len2, _results1;
              _results1 = [];
              for (_k = 0, _len2 = bindings.length; _k < _len2; _k++) {
                binding = bindings[_k];
                _results1.push(doBind(this.data[key], binding));
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this));
    };

    View.prototype.unbindData = function() {
      this.stopListening();
      return delete this.data;
    };

    View.prototype.wrapDomId = function(id) {
      return "" + this.id + id;
    };

    View.prototype.setRegion = function(region) {
      var events, handler, id, key, name, selector, value, _ref2, _results;
      this.region = region;
      events = this.getOptionResult(this.options.events) || {};
      _results = [];
      for (key in events) {
        value = events[key];
        if (!D.isString(value)) {
          throw new Error('The value defined in events must be a string');
        }
        _ref2 = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/), name = _ref2[0], id = _ref2[1];
        if (id) {
          selector = id.charAt(id.length - 1) === '*' ? "[id^=" + (id = this.wrapDomId(id.slice(0, -1))) + "]" : "#" + (id = this.wrapDomId(id));
        }
        handler = this.createHandler(name, id, selector, value);
        _results.push(this.region.delegateEvent(this, name, selector, handler));
      }
      return _results;
    };

    View.prototype.createHandler = function(name, id, selector, value) {
      var me;
      me = this;
      return function() {
        var args, deferred, el, i, _ref2;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        el = $(this);
        if (el.hasClass('disabled')) {
          return;
        }
        if (selector && selector.charAt(0) !== '#') {
          i = el.attr('id');
          args.unshift(i.slice(id.length));
        }
        if (el.data('after-click') === 'defer') {
          deferred = me.createDeferred();
          el.addClass('disabled');
          deferred.always(function() {
            return el.removeClass('disabled');
          });
          if ((_ref2 = me.options.clickDeferred || me.app.options.clickDeferred) != null) {
            _ref2.call(this, deferred, el);
          }
          args.unshift(deferred);
        }
        return me.loadDeferred.done(function() {
          var method;
          method = me.eventHandlers[value];
          if (!method) {
            throw new Error("No handler defined with name: " + value);
          }
          return method.apply(me, args);
        });
      };
    };

    View.prototype.getEl = function() {
      if (this.region) {
        return this.region.getEl(this);
      } else {
        return null;
      }
    };

    View.prototype.$ = function(id) {
      if (!this.region) {
        throw new Error("Region is null");
      }
      return this.region.$$('#' + this.wrapDomId(id));
    };

    View.prototype.$$ = function(selector) {
      if (!this.region) {
        throw new Error("Region is null");
      }
      return this.getEl().find(selector);
    };

    View.prototype.close = function() {
      if (!this.region) {
        return this.createResolvedDeferred(this);
      }
      return this.chain(function() {
        var _ref2;
        return (_ref2 = this.options.beforeClose) != null ? _ref2.apply(this) : void 0;
      }, [
        function() {
          return this.region.undelegateEvents(this);
        }, function() {
          return this.unbindData();
        }, function() {
          return this.destroyComponents();
        }, function() {
          return this.unexportRegions();
        }, function() {
          return this.region.empty(this);
        }
      ], function() {
        var _ref2;
        return (_ref2 = this.options.afterClose) != null ? _ref2.apply(this) : void 0;
      }, this);
    };

    View.prototype.render = function() {
      if (!this.region) {
        throw new Error('No region to render in');
      }
      return this.chain(this.loadDeferred, [this.unbindData, this.destroyComponents, this.unexportRegions], this.bindData, function() {
        var _ref2;
        return (_ref2 = this.options.beforeRender) != null ? _ref2.apply(this) : void 0;
      }, this.beforeRender, this.serializeData, this.options.adjustData || function(data) {
        return data;
      }, this.executeTemplate, this.executeIdReplacement, this.renderComponent, this.exportRegions, this.afterRender, function() {
        var _ref2;
        return (_ref2 = this.options.afterRender) != null ? _ref2.apply(this) : void 0;
      }, this);
    };

    View.prototype.beforeRender = function() {};

    View.prototype.destroyComponents = function() {
      var components, key, value;
      components = this.components || {};
      for (key in components) {
        value = components[key];
        View.ComponentManager.destroy(this, value, this.componentInfos[key]);
      }
      this.components = {};
      return this.componentInfos = {};
    };

    View.prototype.serializeData = function() {
      var data, key, value, _ref2;
      data = {};
      _ref2 = this.data;
      for (key in _ref2) {
        value = _ref2[key];
        data[key] = value.toJSON();
      }
      return data;
    };

    View.prototype.executeTemplate = function(data) {
      var html;
      data.Global = this.app.global;
      data.View = this;
      html = this.template(data);
      return this.region.setHtml(html, this);
    };

    View.prototype.executeIdReplacement = function() {
      var attr, used, _k, _len2, _ref2, _results;
      used = {};
      this.$$('[id]').each((function(_this) {
        return function(i, el) {
          var id;
          el = $(el);
          id = el.attr('id');
          if (used[id]) {
            throw new Error("The id:" + id + " is used more than once.");
          }
          used[id] = true;
          return el.attr('id', _this.wrapDomId(id));
        };
      })(this));
      _ref2 = this.app.options.attributesReferToId || [];
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        attr = _ref2[_k];
        _results.push(this.$$("[" + attr + "]").each((function(_this) {
          return function(i, el) {
            var value, withHash;
            el = $(el);
            value = el.attr(attr);
            withHash = value.charAt(0) === '#';
            if (withHash) {
              return el.attr(attr, '#' + _this.wrapDomId(value.slice(1)));
            } else {
              return el.attr(attr, _this.wrapDomId(value));
            }
          };
        })(this)));
      }
      return _results;
    };

    View.prototype.renderComponent = function() {
      var component, components, promises;
      components = this.getOptionResult(this.options.components) || [];
      promises = (function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = components.length; _k < _len2; _k++) {
          component = components[_k];
          component = this.getOptionResult(component);
          if (component) {
            _results.push(View.ComponentManager.create(this, component));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }).call(this);
      return this.chain(promises, (function(_this) {
        return function(comps) {
          var comp, id, _k, _len2, _results;
          _results = [];
          for (_k = 0, _len2 = comps.length; _k < _len2; _k++) {
            comp = comps[_k];
            if (!(comp)) {
              continue;
            }
            id = comp.id;
            _this.components[id] = comp.component;
            _results.push(_this.componentInfos[id] = comp.info);
          }
          return _results;
        };
      })(this));
    };

    View.prototype.exportRegions = function() {
      this.exportedRegions = {};
      return this.$$('[data-region]').each((function(_this) {
        return function(i, el) {
          var id;
          el = $(el);
          id = el.data('region');
          return _this.exportedRegions[id] = _this.module.addRegion(id, el);
        };
      })(this));
    };

    View.prototype.unexportRegions = function() {
      var key, value;
      return this.chain((function() {
        var _ref2, _results;
        _ref2 = this.exportedRegions;
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          _results.push(value.close());
        }
        return _results;
      }).call(this), (function() {
        var _ref2, _results;
        _ref2 = this.exportedRegions;
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          _results.push(this.module.removeRegion(key));
        }
        return _results;
      }).call(this));
    };

    View.prototype.afterRender = function() {};

    return View;

  })(Base);
  ModuleContainer = (function(_super) {
    __extends(ModuleContainer, _super);

    ModuleContainer.include(D.Event);

    function ModuleContainer() {
      this.modules = {};
      ModuleContainer.__super__.constructor.apply(this, arguments);
    }

    ModuleContainer.prototype.checkId = function(id) {
      if (!(id && D.isString(id))) {
        throw new Error("id: " + id + " is invalid");
      }
      if (this.modules[id]) {
        throw new Error("id: " + id + " is already used");
      }
    };

    ModuleContainer.prototype.get = function(id) {
      return this.modules[id];
    };

    ModuleContainer.prototype.changeId = function(from, to) {
      var module;
      if (from === to) {
        return;
      }
      this.checkId(to);
      module = this.modules[from];
      if (!module) {
        throw new Error("module id: " + from + " not exists");
      }
      delete this.modules[from];
      module.id = to;
      return this.modules[to] = module;
    };

    ModuleContainer.prototype.add = function(module) {
      this.checkId(module.id);
      return this.modules[module.id] = module;
    };

    ModuleContainer.prototype.remove = function(id) {
      return delete this.modules[id];
    };

    return ModuleContainer;

  })(D.Base);
  Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      this.isLayout = true;
      this.loadDeferred = this.chain([this.loadTemplate(), this.loadHandlers()]);
      return delete this.bindData;
    };

    Layout.prototype.setRegion = function() {
      Layout.__super__.setRegion.apply(this, arguments);
      return this.regionInfo = this.module.regionInfo;
    };

    return Layout;

  })(D.View);
  D.Module = Module = (function(_super) {
    __extends(Module, _super);

    Module.Container = ModuleContainer;

    Module.Layout = Layout;

    function Module(name, app, loader, options) {
      var _ref2;
      this.name = name;
      this.app = app;
      this.loader = loader;
      this.options = options != null ? options : {};
      _ref2 = this.name.split('/'), this.baseName = _ref2[_ref2.length - 1];
      this.container = this.options.container || this.app.modules;
      this.separatedTemplate = this.options.separatedTemplate === true;
      this.regions = {};
      Module.__super__.constructor.call(this, 'm');
      this.container.add(this);
      this.container.delegateEvent(this);
    }

    Module.prototype.initialize = function() {
      if (this.options.extend) {
        this.extend(this.options.extend);
      }
      this.loadDeferred = this.createDeferred();
      return this.chain([this.loadTemplate(), this.loadLayout(), this.loadData(), this.loadItems()], function() {
        return this.loadDeferred.resolve();
      });
    };

    Module.prototype.loadTemplate = function() {
      if (this.separatedTemplate) {
        return;
      }
      return this.chain(this.loader.loadTemplate(this), function(template) {
        return this.template = template;
      });
    };

    Module.prototype.loadLayout = function() {
      var layout, name;
      layout = this.getOptionResult(this.options.layout);
      name = D.isString(layout) ? layout : layout != null ? layout.name : void 0;
      name || (name = 'layout');
      return this.chain(this.app.getLoader(name).loadLayout(this, name, layout), (function(_this) {
        return function(obj) {
          return _this.layout = obj;
        };
      })(this));
    };

    Module.prototype.loadData = function() {
      var doLoad, id, items, promises, value;
      this.data = {};
      promises = [];
      items = this.getOptionResult(this.options.data) || {};
      this.autoLoadDuringRender = [];
      this.autoLoadAfterRender = [];
      doLoad = (function(_this) {
        return function(id, value) {
          var name;
          name = D.Loader.analyse(id).name;
          value = _this.getOptionResult(value);
          if (value) {
            if (value.autoLoad === 'after' || value.autoLoad === 'afterRender') {
              _this.autoLoadAfterRender.push(name);
            } else if (value.autoLoad) {
              _this.autoLoadDuringRender.push(name);
            }
          }
          return promises.push(_this.chain(_this.app.getLoader(id).loadModel(value, _this), function(d) {
            return this.data[name] = d;
          }));
        };
      })(this);
      for (id in items) {
        value = items[id];
        doLoad(id, value);
      }
      return this.chain(promises);
    };

    Module.prototype.loadItems = function() {
      var doLoad, items, name, promises;
      this.items = {};
      this.inRegionItems = [];
      promises = [];
      items = this.getOptionResult(this.options.items) || [];
      doLoad = (function(_this) {
        return function(name, item) {
          var isModule, p;
          item = _this.getOptionResult(item);
          if (item && D.isString(item)) {
            item = {
              region: item
            };
          }
          isModule = item.isModule;
          p = _this.chain(_this.app.getLoader(name)[isModule ? 'loadModule' : 'loadView'](name, _this, item), function(obj) {
            _this.items[obj.name] = obj;
            obj.regionInfo = item;
            if (item.region) {
              return _this.inRegionItems.push(obj);
            }
          });
          return promises.push(p);
        };
      })(this);
      for (name in items) {
        item = items[name];
        doLoad(name, item);
      }
      return this.chain(promises);
    };

    Module.prototype.addRegion = function(name, el) {
      var type;
      type = el.data('region-type');
      return this.regions[name] = Region.create(type, this.app, this, el);
    };

    Module.prototype.removeRegion = function(name) {
      return delete this.regions[name];
    };

    Module.prototype.render = function(options) {
      if (options == null) {
        options = {};
      }
      if (!this.region) {
        throw new Error('No region to render in');
      }
      this.renderOptions = options;
      if (options.id) {
        this.container.changeId(this.id, options.id);
      }
      return this.chain(this.loadDeferred, function() {
        var _ref2;
        return (_ref2 = this.options.beforeRender) != null ? _ref2.apply(this) : void 0;
      }, function() {
        return this.layout.setRegion(this.region);
      }, this.fetchDataDuringRender, function() {
        return this.layout.render();
      }, function() {
        var _ref2;
        return (_ref2 = this.options.afterLayoutRender) != null ? _ref2.apply(this) : void 0;
      }, function() {
        var key, region, value, _k, _len2, _ref2, _results;
        _ref2 = this.inRegionItems;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          value = _ref2[_k];
          key = value.regionInfo.region;
          region = this.regions[key];
          if (!region) {
            throw new Error("Can not find region: " + key);
          }
          _results.push(region.show(value));
        }
        return _results;
      }, function() {
        var _ref2;
        return (_ref2 = this.options.afterRender) != null ? _ref2.apply(this) : void 0;
      }, this.fetchDataAfterRender, this);
    };

    Module.prototype.setRegion = function(region) {
      this.region = region;
    };

    Module.prototype.close = function() {
      return this.chain(function() {
        var _ref2;
        return (_ref2 = this.options.beforeClose) != null ? _ref2.apply(this) : void 0;
      }, function() {
        return this.layout.close();
      }, function() {
        var key, value, _ref2, _results;
        _ref2 = this.regions;
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          _results.push(value.close());
        }
        return _results;
      }, function() {
        var _ref2;
        return (_ref2 = this.options.afterClose) != null ? _ref2.apply(this) : void 0;
      }, function() {
        return this.container.remove(this.id);
      }, this);
    };

    Module.prototype.fetchDataDuringRender = function() {
      var id;
      return this.chain((function() {
        var _base, _k, _len2, _ref2, _results;
        _ref2 = this.autoLoadDuringRender;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          id = _ref2[_k];
          _results.push(typeof (_base = this.data[id]).get === "function" ? _base.get() : void 0);
        }
        return _results;
      }).call(this));
    };

    Module.prototype.fetchDataAfterRender = function() {
      var id;
      return this.chain((function() {
        var _base, _k, _len2, _ref2, _results;
        _ref2 = this.autoLoadAfterRender;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          id = _ref2[_k];
          _results.push(typeof (_base = this.data[id]).get === "function" ? _base.get() : void 0);
        }
        return _results;
      }).call(this));
    };

    return Module;

  })(D.Base);
  D.Loader = Loader = (function(_super) {
    __extends(Loader, _super);

    Loader.TemplateCache = {};

    Loader.analyse = function(name) {
      var args, loaderName, _ref2;
      if (!D.isString(name)) {
        return {
          loader: null,
          name: name
        };
      }
      _ref2 = name.split(':'), loaderName = _ref2[0], name = _ref2[1], args = 3 <= _ref2.length ? __slice.call(_ref2, 2) : [];
      if (!name) {
        name = loaderName;
        loaderName = null;
      }
      return {
        loader: loaderName,
        name: name,
        args: args
      };
    };

    function Loader(app) {
      this.app = app;
      this.name = 'default';
      this.fileNames = this.app.options.fileNames;
      Loader.__super__.constructor.apply(this, arguments);
    }

    Loader.prototype.loadResource = function(path, plugin) {
      var deferred, error;
      path = D.joinPath(this.app.options.scriptRoot, path);
      if (plugin) {
        path = plugin + '!' + path;
      }
      deferred = this.createDeferred();
      error = function(e) {
        var _ref2;
        if (((_ref2 = e.requireModules) != null ? _ref2[0] : void 0) === path) {
          define(path, null);
          require.undef(path);
          require([path], function() {});
          return deferred.resolve(null);
        } else {
          deferred.reject(null);
          throw e;
        }
      };
      require([path], (function(_this) {
        return function(obj) {
          if (D.isFunction(obj)) {
            obj = obj(_this.app);
          }
          return deferred.resolve(obj);
        };
      })(this), error);
      return deferred.promise();
    };

    Loader.prototype.loadModuleResource = function(module, path, plugin) {
      return this.loadResource(D.joinPath(module.name, path), plugin);
    };

    Loader.prototype.loadModule = function(path, parentModule) {
      var name;
      name = Loader.analyse(path).name;
      return this.chain(this.loadResource(D.joinPath(name, this.fileNames.module)), (function(_this) {
        return function(options) {
          return new D.Module(name, _this.app, _this, options);
        };
      })(this));
    };

    Loader.prototype.loadView = function(name, module, options) {
      name = Loader.analyse(name).name;
      return this.chain(this.loadModuleResource(module, this.fileNames.view + name), (function(_this) {
        return function(options) {
          return new D.View(name, module, _this, options);
        };
      })(this));
    };

    Loader.prototype.loadLayout = function(module, name, layout) {
      if (layout == null) {
        layout = {};
      }
      name = Loader.analyse(name).name;
      return this.chain(layout.templateOnly === false ? this.loadModuleResource(module, name) : {}, (function(_this) {
        return function(options) {
          return new D.Module.Layout(name, module, _this, D.extend(layout, options));
        };
      })(this));
    };

    Loader.prototype.innerLoadTemplate = function(module, p) {
      var path, template;
      path = p + this.fileNames.templateSuffix;
      template = Loader.TemplateCache[module.name + path];
      if (!template) {
        template = Loader.TemplateCache[module.name + path] = this.loadModuleResource(module, path, 'text');
      }
      return this.chain(template, function(t) {
        if (D.isString(t)) {
          t = Loader.TemplateCache[path] = Handlebars.compile(t);
        }
        return t;
      });
    };

    Loader.prototype.loadTemplate = function(module) {
      var path;
      path = this.fileNames.templates;
      return this.innerLoadTemplate(module, path);
    };

    Loader.prototype.loadSeparatedTemplate = function(view, name) {
      var path;
      path = this.fileNames.template + name;
      return this.innerLoadTemplate(view.module, path);
    };

    Loader.prototype.loadModel = function(name, module) {
      if (name == null) {
        name = '';
      }
      if (name instanceof D.Model) {
        return name;
      }
      if (D.isString(name)) {
        name = {
          url: name
        };
      }
      return new D.Model(this.app, module, name);
    };

    Loader.prototype.loadHandlers = function(view, name) {
      return view.options.handlers || {};
    };

    Loader.prototype.loadRouter = function(path) {
      var name;
      name = Loader.analyse(path).name;
      path = D.joinPath(name, this.fileNames.router);
      if (path.charAt(0) === '/') {
        path = path.slice(1);
      }
      return this.loadResource(path);
    };

    return Loader;

  })(D.Base);
  D.SimpleLoader = SimpleLoader = (function(_super) {
    __extends(SimpleLoader, _super);

    function SimpleLoader() {
      SimpleLoader.__super__.constructor.apply(this, arguments);
      this.name = 'simple';
    }

    SimpleLoader.prototype.loadModule = function(path, parentModule) {
      var name;
      name = Loader.analyse(path).name;
      return this.deferred(new D.Module(name, this.app, this, {
        separatedTemplate: true
      }));
    };

    SimpleLoader.prototype.loadView = function(name, module, item) {
      name = Loader.analyse(name).name;
      return this.deferred(new D.View(name, module, this, {}));
    };

    return SimpleLoader;

  })(D.Loader);
  Route = (function() {
    Route.prototype.regExps = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

    function Route(app, router, path, fn) {
      var pattern;
      this.app = app;
      this.router = router;
      this.path = path;
      this.fn = fn;
      pattern = path.replace(this.regExps[0], this.regExps[1]).replace(this.regExps[2], this.regExps[3]);
      this.pattern = new RegExp("^" + pattern + "$", this.app.options.caseSensitiveHash ? 'g' : 'gi');
    }

    Route.prototype.match = function(hash) {
      this.pattern.lastIndex = 0;
      return this.pattern.test(hash);
    };

    Route.prototype.handle = function(hash) {
      var args, fns, i, route, routes, _ref2;
      this.pattern.lastIndex = 0;
      args = this.pattern.exec(hash).slice(1);
      routes = this.router.getDependencies(this.path);
      routes.push(this);
      fns = (function() {
        var _k, _len2, _results;
        _results = [];
        for (i = _k = 0, _len2 = routes.length; _k < _len2; i = ++_k) {
          route = routes[i];
          _results.push((function(route, i) {
            return function(prev) {
              return route.fn.apply(route, (i > 0 ? [prev].concat(args) : args));
            };
          })(route, i));
        }
        return _results;
      })();
      return (_ref2 = this.router).chain.apply(_ref2, fns);
    };

    return Route;

  })();
  D.Router = Router = (function(_super) {
    __extends(Router, _super);

    function Router(app) {
      this.app = app;
      this.routes = [];
      this.routeMap = {};
      this.dependencies = {};
      this.started = false;
      Router.__super__.constructor.call(this, 'ro');
    }

    Router.prototype.initialize = function() {
      return this.addRoute('/', this.app.options.defaultRouter);
    };

    Router.prototype.getHash = function() {
      return root.location.hash.slice(1);
    };

    Router.prototype.start = function(defaultPath) {
      var hash;
      if (this.started) {
        return;
      }
      this.started = true;
      $(root).on('popstate.dr', (function(_this) {
        return function() {
          return _this.dispatch(_this.getHash());
        };
      })(this));
      if (hash = this.getHash()) {
        return this.navigate(hash, true);
      } else if (defaultPath) {
        return this.navigate(defaultPath, true);
      }
    };

    Router.prototype.stop = function() {
      $(root).off('.dr');
      return this.started = false;
    };

    Router.prototype.dispatch = function(hash) {
      var route, _k, _len2, _ref2;
      if (this.previousHash === hash) {
        return;
      }
      this.previousHash = hash;
      _ref2 = this.routes;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        route = _ref2[_k];
        if (route.match(hash)) {
          return route.handle(hash);
        }
      }
    };

    Router.prototype.navigate = function(path, trigger) {
      root.history.pushState({}, root.document.title, "#" + path);
      if (trigger) {
        return this.dispatch(path);
      }
    };

    Router.prototype.mountRoutes = function() {
      var path, paths;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.chain((function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = paths.length; _k < _len2; _k++) {
          path = paths[_k];
          _results.push(this.app.getLoader(path).loadRouter(path));
        }
        return _results;
      }).call(this), function(routers) {
        var i, router, _k, _len2, _results;
        _results = [];
        for (i = _k = 0, _len2 = routers.length; _k < _len2; i = ++_k) {
          router = routers[i];
          _results.push(this.addRoute(paths[i], router));
        }
        return _results;
      });
    };

    Router.prototype.addRoute = function(path, router) {
      var dependencies, key, p, route, routes, v, value, _results;
      routes = this.getOptionResult(router.routes);
      dependencies = this.getOptionResult(router.deps);
      for (key in dependencies) {
        value = dependencies[key];
        p = D.joinPath(path, key).replace(/^\//, '');
        v = value.charAt(0) === '/' ? value.slice(1) : D.joinPath(path, value);
        this.dependencies[p] = v.replace(/^\//, '');
      }
      _results = [];
      for (key in routes) {
        value = routes[key];
        p = D.joinPath(path, key).replace(/(^\/|\/$)/g, '');
        route = new Route(this.app, this, p, router[value]);
        this.routes.unshift(route);
        _results.push(this.routeMap[p] = route);
      }
      return _results;
    };

    Router.prototype.getDependencies = function(path) {
      var d, deps;
      deps = [];
      d = this.dependencies[path];
      while (d != null) {
        deps.unshift(this.routeMap[d]);
        d = this.dependencies[d];
      }
      return deps;
    };

    return Router;

  })(D.Base);
  D.Helpers = {
    layout: function(app, Handlebars, options) {
      if (this.View.isLayout) {
        return options.fn(this);
      } else {
        return '';
      }
    },
    view: function(app, Handlebars, name, options) {
      if (this.View.isLayout || this.View.name !== name) {
        return '';
      }
      return options.fn(this);
    }
  };
  D.MultiRegion = MultiRegion = (function(_super) {
    __extends(MultiRegion, _super);

    function MultiRegion() {
      MultiRegion.__super__.constructor.apply(this, arguments);
      this.items = {};
      this.elements = {};
    }

    MultiRegion.prototype.activate = function(item) {};

    MultiRegion.prototype.createElement = function(key, item) {
      var el;
      el = $('<div></div>');
      this.el.append(el);
      return el;
    };

    MultiRegion.prototype.getEl = function(item) {
      var key, _ref2;
      if (!item) {
        return this.el;
      }
      key = (_ref2 = item.regionInfo) != null ? _ref2.key : void 0;
      if (!key) {
        return null;
      }
      return this.elements[key] || (this.elements[key] = this.createElement(key, item));
    };

    MultiRegion.prototype.close = function(item) {
      var key, _ref2;
      if (item) {
        key = (_ref2 = item.regionInfo) != null ? _ref2.key : void 0;
        if (!(key && this.items[key])) {
          return this.createResolvedDeferred(this);
        }
        if (this.items[key].id !== item.id) {
          throw new Error('Trying to close an item which is not in the region');
        }
        return this.chain(function() {
          return item.close();
        }, function() {
          return delete this.items[key];
        }, this);
      }
      return this.chain(function() {
        var k, v, _ref3, _results;
        _ref3 = this.items;
        _results = [];
        for (k in _ref3) {
          v = _ref3[k];
          _results.push(v.close());
        }
        return _results;
      }, function() {
        this.items = {};
        return this.elements = {};
      }, this);
    };

    MultiRegion.prototype.getCurrentItem = function(item, options) {
      var i, key, _ref2;
      if (options == null) {
        options = {};
      }
      key = D.isString(item) ? options.regionKey : (_ref2 = item.regionInfo) != null ? _ref2.key : void 0;
      if (key) {
        if (i = this.items[key]) {
          return i;
        } else {
          return {
            regionInfo: {
              key: key
            }
          };
        }
      } else {
        return null;
      }
    };

    MultiRegion.prototype.setCurrentItem = function(item, options) {
      var info, key;
      info = item.regionInfo || (item.regionInfo = {});
      key = info.key || (info.key = options.regionKey || D.uniqueId('K'));
      return this.items[key] = item;
    };

    MultiRegion.prototype.setHtml = function(html, item) {
      return this.getEl(item).html(html);
    };

    MultiRegion.prototype.empty = function(item) {
      if (item) {
        return this.getEl(item).remove();
      } else {
        return this.el.empty();
      }
    };

    return MultiRegion;

  })(D.Region);
  return Drizzle;
});

//# sourceMappingURL=drizzle-all.js.map
