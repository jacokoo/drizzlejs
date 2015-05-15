
/*!
 * DrizzleJS v0.2.9
 * -------------------------------------
 * Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */
var slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  var Application, Base, D, DefaultConfigs, Drizzle, Layout, Loader, Model, Module, ModuleContainer, Region, Route, Router, SimpleLoader, View, fn1, fn2, idCounter, item, j, k, len, len1, oldReference, pushStateSupported, ref, ref1;
  D = Drizzle = {
    version: '0.2.9'
  };
  oldReference = root.Drizzle;
  idCounter = 0;
  ref = ['Function', 'Object', 'String', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'];
  fn1 = function(item) {
    return D["is" + item] = function(obj) {
      return Object.prototype.toString.call(obj) === ("[object " + item + "]");
    };
  };
  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j];
    fn1(item);
  }
  D.extend = function() {
    var k, key, len1, mixin, mixins, target, value;
    target = arguments[0], mixins = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (!D.isObject(target)) {
      return target;
    }
    for (k = 0, len1 = mixins.length; k < len1; k++) {
      mixin = mixins[k];
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
      var path, paths, s;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      path = paths.join('/');
      s = '';
      if (path.indexOf('http') === 0) {
        s = path.slice(0, 7);
        path = path.slice(7);
      }
      path = path.replace(/\/+/g, '/');
      return s + path;
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
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      d = this.createDeferred();
      d.reject.apply(d, args);
      return d;
    },
    createResolvedDeferred: function() {
      var args, d;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      d = this.createDeferred();
      d.resolve.apply(d, args);
      return d;
    },
    deferred: function() {
      var args, fn, obj;
      fn = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
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
      rings = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
            var k, len1, results;
            results = [];
            for (k = 0, len1 = item.length; k < len1; k++) {
              inArray = item[k];
              args = [inArray];
              if (i > 0) {
                args.push(gots[i - 1]);
              }
              results.push(this.deferred.apply(this, args));
            }
            return results;
          }).call(_this), $.when.apply($, promises)) : (args = [item], i > 0 ? args.push(gots[i - 1]) : void 0, _this.deferred.apply(_this, args))).done(function() {
            var data;
            data = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            gotResult(data);
            if (rings.length === 0) {
              return obj.resolve(gots[gots.length - 1]);
            } else {
              return doItem(rings.shift(), ++i);
            }
          }).fail(function() {
            var data;
            data = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      var base1;
      this.registeredEvents || (this.registeredEvents = {});
      ((base1 = this.registeredEvents)[name] || (base1[name] = [])).push({
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
        var k, len1, results;
        results = [];
        for (k = 0, len1 = events.length; k < len1; k++) {
          item = events[k];
          if (item.fn !== callback || (context && context !== item.context)) {
            results.push(item);
          }
        }
        return results;
      })();
      if (this.registeredEvents[name].length === 0) {
        delete this.registeredEvents[name];
      }
      return this;
    },
    trigger: function() {
      var args, events, k, len1, name;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!(this.registeredEvents && (events = this.registeredEvents[name]))) {
        return this;
      }
      for (k = 0, len1 = events.length; k < len1; k++) {
        item = events[k];
        item.fn.apply(item.context, args);
      }
      return this;
    },
    delegateEvent: function(target) {
      return D.extend(target, {
        on: (function(_this) {
          return function(name, callback, context) {
            target.listenTo(_this, name + "." + target.id, callback, context);
            return target;
          };
        })(this),
        off: (function(_this) {
          return function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            if (args.length > 0) {
              args.unshift((args.shift()) + "." + target.id);
            }
            args.unshift(_this);
            target.stopListening.apply(target, args);
            return target;
          };
        })(this),
        trigger: (function(_this) {
          return function() {
            var args, name;
            name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            args.unshift(name + "." + target.id);
            _this.trigger.apply(_this, args);
            return target;
          };
        })(this),
        listenTo: function(obj, name, callback, context) {
          var base1, ctx;
          ctx = context || this;
          this.registeredListeners || (this.registeredListeners = {});
          ((base1 = this.registeredListeners)[name] || (base1[name] = [])).push({
            fn: callback,
            obj: obj,
            context: ctx
          });
          obj.on(name, callback, ctx);
          return this;
        },
        stopListening: function(obj, name, callback) {
          var k, key, l, len1, len2, ref1, ref2, value;
          if (!this.registeredListeners) {
            return this;
          }
          if (!obj) {
            ref1 = this.registeredListeners;
            for (key in ref1) {
              value = ref1[key];
              for (k = 0, len1 = value.length; k < len1; k++) {
                item = value[k];
                item.obj.off(key, item.fn, this);
              }
            }
            this.registeredListeners = {};
            return this;
          }
          ref2 = this.registeredListeners;
          for (key in ref2) {
            value = ref2[key];
            if (name && name !== key) {
              continue;
            }
            this.registeredListeners[key] = [];
            for (l = 0, len2 = value.length; l < len2; l++) {
              item = value[l];
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
        urls.pop();
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
    save: function(model, options) {
      if (model.data.id) {
        return this.put(model, options);
      } else {
        return this.post(model, options);
      }
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
      return model.chain($.ajax(params), function(arg) {
        var resp, status, xhr;
        resp = arg[0], status = arg[1], xhr = arg[2];
        model.set(resp);
        return xhr;
      });
    }
  };
  Drizzle.Base = Base = (function() {
    Base.include = function() {
      var k, key, len1, mixin, mixins, value;
      mixins = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      for (k = 0, len1 = mixins.length; k < len1; k++) {
        mixin = mixins[k];
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
      var doExtend, key, results, value;
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
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      results = [];
      for (key in mixins) {
        value = mixins[key];
        results.push(doExtend(key, value));
      }
      return results;
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
  D.Application = Application = (function(superClass) {
    extend(Application, superClass);

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
      var key, ref1, value;
      this.registerLoader(new D.SimpleLoader(this));
      this.registerLoader(new D.Loader(this), true);
      ref1 = D.Helpers;
      for (key in ref1) {
        value = ref1[key];
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
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      var defaultPath, paths, ref1;
      defaultPath = arguments[0], paths = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!this.router) {
        this.router = new D.Router(this);
      }
      return this.chain((ref1 = this.router).mountRoutes.apply(ref1, paths), function() {
        return this.router.start(defaultPath);
      });
    };

    Application.prototype.navigate = function(path, trigger) {
      return this.router.navigate(path, trigger);
    };

    Application.prototype.load = function() {
      var name, names;
      names = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.chain((function() {
        var k, len1, results;
        results = [];
        for (k = 0, len1 = names.length; k < len1; k++) {
          name = names[k];
          results.push(this.getLoader(name).loadModule(name));
        }
        return results;
      }).call(this));
    };

    Application.prototype.show = function(feature, options) {
      return this.region.show(feature, options);
    };

    Application.prototype.destory = function() {
      var region;
      return this.chain((function() {
        var k, len1, ref1, results;
        ref1 = this.regions;
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          region = ref1[k];
          results.push(region.close());
        }
        return results;
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
  D.Model = Model = (function(superClass) {
    extend(Model, superClass);

    function Model(app1, module1, options1) {
      var defaults, p;
      this.app = app1;
      this.module = module1;
      this.options = options1 != null ? options1 : {};
      this.data = this.options.data || {};
      this.params = {};
      if (this.options.pageable) {
        defaults = this.app.options.pagination;
        p = this.pagination = {
          page: this.options.page || 1,
          pageCount: 0,
          pageSize: this.options.pageSize || defaults.defaultPageSize,
          pageKey: this.options.pageKey || defaults.pageKey,
          pageSizeKey: this.options.pageSizeKey || defaults.pageSizeKey,
          recordCountKey: this.options.recordCountKey || defaults.recordCountKey
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

    Model.prototype.setForm = function(form) {
      var data, k, len1, o, ref1;
      if (!(form && form.serializeArray)) {
        return;
      }
      data = {};
      ref1 = form.serializeArray();
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        item = ref1[k];
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
      return this.data = data;
    };

    Model.prototype.find = function(name, value) {
      var k, len1, ref1, results;
      if (!D.isArray(this.data)) {
        return null;
      }
      ref1 = this.data;
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        item = ref1[k];
        if (item[name] === value) {
          results.push(item);
        }
      }
      return results;
    };

    Model.prototype.findOne = function(name, value) {
      var k, len1, ref1;
      if (!D.isArray(this.data)) {
        return null;
      }
      ref1 = this.data;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        item = ref1[k];
        if (item[name] === value) {
          return item;
        }
      }
    };

    Model.prototype.url = function() {
      return this.getOptionResult(this.options.url) || '';
    };

    Model.prototype.getFullUrl = function() {
      return D.Request.url(this);
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
  ref1 = ['get', 'post', 'put', 'del', 'save'];
  fn2 = function(item) {
    return D.Model.prototype[item] = function(options) {
      return this.chain(D.Request[item](this, options), function(arg) {
        var xhr;
        xhr = arg[arg.length - 1];
        this.trigger('sync');
        return xhr;
      });
    };
  };
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    item = ref1[k];
    fn2(item);
  }
  D.Region = Region = (function(superClass) {
    extend(Region, superClass);

    Region.types = {};

    Region.register = function(name, clazz) {
      return this.types[name] = clazz;
    };

    Region.create = function(type, app, module, el) {
      var clazz;
      clazz = this.types[type] || Region;
      return new clazz(app, module, el);
    };

    function Region(app1, module1, el) {
      this.app = app1;
      this.module = module1;
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
          if (options.forceRender === false) {
            return this.createResolvedDeferred(cur);
          }
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
      ], function(arg) {
        var item;
        item = arg[0];
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
      n = name + ".events" + this.id + item.id;
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
  D.View = View = (function(superClass) {
    extend(View, superClass);

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

    function View(name1, module1, loader1, options1) {
      this.name = name1;
      this.module = module1;
      this.loader = loader1;
      this.options = options1 != null ? options1 : {};
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
          var bind, binding, bindings, doBind, key, results, value;
          bind = _this.getOptionResult(_this.options.bind) || {};
          _this.data = {};
          doBind = function(model, binding) {
            var event, handler, ref2;
            ref2 = binding.split('#'), event = ref2[0], handler = ref2[1];
            return _this.listenTo(model, event, function() {
              var args, base1;
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              if (!(event && handler)) {
                throw new Error("Incorrect binding string format:" + binding);
              }
              return typeof this[handler] === "function" ? this[handler].apply(this, args) : void 0;
              return typeof (base1 = this.eventHandlers)[handler] === "function" ? base1[handler].apply(base1, args) : void 0;
              throw new Error("Can not find handler function for :" + handler);
            });
          };
          results = [];
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
            results.push((function() {
              var l, len2, results1;
              results1 = [];
              for (l = 0, len2 = bindings.length; l < len2; l++) {
                binding = bindings[l];
                results1.push(doBind(this.data[key], binding));
              }
              return results1;
            }).call(_this));
          }
          return results;
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

    View.prototype.setRegion = function(region1) {
      var events, handler, id, key, name, ref2, results, selector, value;
      this.region = region1;
      events = this.getOptionResult(this.options.events) || {};
      results = [];
      for (key in events) {
        value = events[key];
        if (!D.isString(value)) {
          throw new Error('The value defined in events must be a string');
        }
        ref2 = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/), name = ref2[0], id = ref2[1];
        if (id) {
          selector = id.charAt(id.length - 1) === '*' ? "[id^=" + (id = this.wrapDomId(id.slice(0, -1))) + "]" : "#" + (id = this.wrapDomId(id));
        }
        handler = this.createHandler(name, id, selector, value);
        results.push(this.region.delegateEvent(this, name, selector, handler));
      }
      return results;
    };

    View.prototype.createHandler = function(name, id, selector, value) {
      var me;
      me = this;
      return function() {
        var args, deferred, el, i, ref2;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
          if ((ref2 = me.options.clickDeferred || me.app.options.clickDeferred) != null) {
            ref2.call(this, deferred, el);
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
        var ref2;
        return (ref2 = this.options.beforeClose) != null ? ref2.apply(this) : void 0;
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
        var ref2;
        return (ref2 = this.options.afterClose) != null ? ref2.apply(this) : void 0;
      }, function() {
        return delete this.region;
      }, this);
    };

    View.prototype.render = function(options) {
      if (options == null) {
        options = {};
      }
      if (!this.region) {
        throw new Error('No region to render in');
      }
      this.renderOptions = options;
      return this.chain(this.loadDeferred, [this.unbindData, this.destroyComponents, this.unexportRegions], this.bindData, function() {
        var ref2;
        return (ref2 = this.options.beforeRender) != null ? ref2.apply(this) : void 0;
      }, this.beforeRender, this.serializeData, this.options.adjustData || function(data) {
        return data;
      }, this.executeTemplate, this.executeIdReplacement, this.renderComponent, this.exportRegions, this.afterRender, function() {
        var ref2;
        return (ref2 = this.options.afterRender) != null ? ref2.apply(this) : void 0;
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
      var data, key, ref2, value;
      data = {};
      ref2 = this.data;
      for (key in ref2) {
        value = ref2[key];
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
      var attr, l, len2, ref2, results, used;
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
      ref2 = this.app.options.attributesReferToId || [];
      results = [];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        attr = ref2[l];
        results.push(this.$$("[" + attr + "]").each((function(_this) {
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
      return results;
    };

    View.prototype.renderComponent = function() {
      var component, components, promises;
      components = this.getOptionResult(this.options.components) || [];
      promises = (function() {
        var l, len2, results;
        results = [];
        for (l = 0, len2 = components.length; l < len2; l++) {
          component = components[l];
          component = this.getOptionResult(component);
          if (component) {
            results.push(View.ComponentManager.create(this, component));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }).call(this);
      return this.chain(promises, (function(_this) {
        return function(comps) {
          var comp, id, l, len2, results;
          results = [];
          for (l = 0, len2 = comps.length; l < len2; l++) {
            comp = comps[l];
            if (!(comp)) {
              continue;
            }
            id = comp.id;
            _this.components[id] = comp.component;
            results.push(_this.componentInfos[id] = comp.info);
          }
          return results;
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
        var ref2, results;
        ref2 = this.exportedRegions;
        results = [];
        for (key in ref2) {
          value = ref2[key];
          results.push(value.close());
        }
        return results;
      }).call(this), (function() {
        var ref2, results;
        ref2 = this.exportedRegions;
        results = [];
        for (key in ref2) {
          value = ref2[key];
          results.push(this.module.removeRegion(key));
        }
        return results;
      }).call(this));
    };

    View.prototype.afterRender = function() {};

    return View;

  })(Base);
  ModuleContainer = (function(superClass) {
    extend(ModuleContainer, superClass);

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
  Layout = (function(superClass) {
    extend(Layout, superClass);

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
  D.Module = Module = (function(superClass) {
    extend(Module, superClass);

    Module.Container = ModuleContainer;

    Module.Layout = Layout;

    function Module(name1, app1, loader1, options1) {
      var ref2;
      this.name = name1;
      this.app = app1;
      this.loader = loader1;
      this.options = options1 != null ? options1 : {};
      ref2 = this.name.split('/'), this.baseName = ref2[ref2.length - 1];
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
        var ref2;
        return (ref2 = this.options.beforeRender) != null ? ref2.apply(this) : void 0;
      }, function() {
        return this.layout.setRegion(this.region);
      }, this.fetchDataDuringRender, function() {
        return this.layout.render();
      }, function() {
        var ref2;
        return (ref2 = this.options.afterLayoutRender) != null ? ref2.apply(this) : void 0;
      }, function() {
        var defers, key, region, value;
        defers = (function() {
          var l, len2, ref2, results;
          ref2 = this.inRegionItems;
          results = [];
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            value = ref2[l];
            key = value.regionInfo.region;
            region = this.regions[key];
            if (!region) {
              throw new Error("Can not find region: " + key);
            }
            results.push(region.show(value));
          }
          return results;
        }).call(this);
        return $.when.apply($, defers);
      }, function() {
        var ref2;
        return (ref2 = this.options.afterRender) != null ? ref2.apply(this) : void 0;
      }, this.fetchDataAfterRender, this);
    };

    Module.prototype.setRegion = function(region1) {
      this.region = region1;
    };

    Module.prototype.close = function() {
      return this.chain(function() {
        var ref2;
        return (ref2 = this.options.beforeClose) != null ? ref2.apply(this) : void 0;
      }, function() {
        return this.layout.close();
      }, function() {
        var key, ref2, results, value;
        ref2 = this.regions;
        results = [];
        for (key in ref2) {
          value = ref2[key];
          results.push(value.close());
        }
        return results;
      }, function() {
        var ref2;
        return (ref2 = this.options.afterClose) != null ? ref2.apply(this) : void 0;
      }, function() {
        return this.container.remove(this.id);
      }, this);
    };

    Module.prototype.fetchDataDuringRender = function() {
      var id;
      return this.chain((function() {
        var base1, l, len2, ref2, results;
        ref2 = this.autoLoadDuringRender;
        results = [];
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          id = ref2[l];
          results.push(typeof (base1 = this.data[id]).get === "function" ? base1.get() : void 0);
        }
        return results;
      }).call(this));
    };

    Module.prototype.fetchDataAfterRender = function() {
      var id;
      return this.chain((function() {
        var base1, l, len2, ref2, results;
        ref2 = this.autoLoadAfterRender;
        results = [];
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          id = ref2[l];
          results.push(typeof (base1 = this.data[id]).get === "function" ? base1.get() : void 0);
        }
        return results;
      }).call(this));
    };

    return Module;

  })(D.Base);
  D.Loader = Loader = (function(superClass) {
    extend(Loader, superClass);

    Loader.TemplateCache = {};

    Loader.analyse = function(name) {
      var args, loaderName, ref2;
      if (!D.isString(name)) {
        return {
          loader: null,
          name: name
        };
      }
      ref2 = name.split(':'), loaderName = ref2[0], name = ref2[1], args = 3 <= ref2.length ? slice.call(ref2, 2) : [];
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

    function Loader(app1) {
      this.app = app1;
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
        var ref2;
        if (((ref2 = e.requireModules) != null ? ref2[0] : void 0) === path) {
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
          var module;
          module = new D.Module(name, _this.app, _this, options);
          if (parentModule) {
            module.module = parentModule;
          }
          return module;
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
  D.SimpleLoader = SimpleLoader = (function(superClass) {
    extend(SimpleLoader, superClass);

    function SimpleLoader() {
      SimpleLoader.__super__.constructor.apply(this, arguments);
      this.name = 'simple';
    }

    SimpleLoader.prototype.loadModule = function(path, parentModule) {
      var module, name;
      name = Loader.analyse(path).name;
      module = new D.Module(name, this.app, this, {
        separatedTemplate: true
      });
      if (parentModule) {
        module.parentModule = parentModule;
      }
      return this.deferred(module);
    };

    SimpleLoader.prototype.loadView = function(name, module, item) {
      name = Loader.analyse(name).name;
      return this.deferred(new D.View(name, module, this, {}));
    };

    return SimpleLoader;

  })(D.Loader);
  pushStateSupported = root.history && indexOf.call(root.history, 'pushState') >= 0;
  Route = (function() {
    Route.prototype.regExps = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

    function Route(app1, router1, path1, fn3) {
      var pattern;
      this.app = app1;
      this.router = router1;
      this.path = path1;
      this.fn = fn3;
      pattern = this.path.replace(this.regExps[0], this.regExps[1]).replace(this.regExps[2], this.regExps[3]);
      this.pattern = new RegExp("^" + pattern + "$", this.app.options.caseSensitiveHash ? 'g' : 'gi');
    }

    Route.prototype.match = function(hash) {
      this.pattern.lastIndex = 0;
      return this.pattern.test(hash);
    };

    Route.prototype.handle = function(hash) {
      var args, fns, i, ref2, route, routes;
      this.pattern.lastIndex = 0;
      args = this.pattern.exec(hash).slice(1);
      routes = this.router.getDependencies(this.path);
      routes.push(this);
      fns = (function() {
        var l, len2, results;
        results = [];
        for (i = l = 0, len2 = routes.length; l < len2; i = ++l) {
          route = routes[i];
          results.push((function(route, i) {
            return function(prev) {
              return route.fn.apply(route, (i > 0 ? [prev].concat(args) : args));
            };
          })(route, i));
        }
        return results;
      })();
      return (ref2 = this.router).chain.apply(ref2, fns);
    };

    return Route;

  })();
  D.Router = Router = (function(superClass) {
    extend(Router, superClass);

    function Router(app1) {
      this.app = app1;
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
      var hash, key;
      if (this.started) {
        return;
      }
      this.started = true;
      key = pushStateSupported ? 'popstate.dr' : 'hashchange.dr';
      $(root).on(key, (function(_this) {
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
      var l, len2, ref2, route;
      if (this.previousHash === hash) {
        return;
      }
      this.previousHash = hash;
      ref2 = this.routes;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        route = ref2[l];
        if (route.match(hash)) {
          return route.handle(hash);
        }
      }
    };

    Router.prototype.navigate = function(path, trigger) {
      if (pushStateSupported) {
        root.history.pushState({}, root.document.title, "#" + path);
      } else {
        root.location.replace("#" + path);
      }
      if (trigger) {
        return this.dispatch(path);
      }
    };

    Router.prototype.mountRoutes = function() {
      var path, paths;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.chain((function() {
        var l, len2, results;
        results = [];
        for (l = 0, len2 = paths.length; l < len2; l++) {
          path = paths[l];
          results.push(this.app.getLoader(path).loadRouter(path));
        }
        return results;
      }).call(this), function(routers) {
        var i, l, len2, results, router;
        results = [];
        for (i = l = 0, len2 = routers.length; l < len2; i = ++l) {
          router = routers[i];
          results.push(this.addRoute(paths[i], router));
        }
        return results;
      });
    };

    Router.prototype.addRoute = function(path, router) {
      var dependencies, key, p, results, route, routes, v, value;
      routes = this.getOptionResult(router.routes);
      dependencies = this.getOptionResult(router.deps);
      for (key in dependencies) {
        value = dependencies[key];
        p = D.joinPath(path, key).replace(/^\//, '');
        v = value.charAt(0) === '/' ? value.slice(1) : D.joinPath(path, value);
        this.dependencies[p] = v.replace(/^\//, '');
      }
      results = [];
      for (key in routes) {
        value = routes[key];
        p = D.joinPath(path, key).replace(/(^\/|\/$)/g, '');
        if (!D.isFunction(router[value])) {
          throw new Error("Route [" + key + ": " + value + "] is not defined");
        }
        route = new Route(this.app, this, p, router[value]);
        this.routes.unshift(route);
        results.push(this.routeMap[p] = route);
      }
      return results;
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
  return Drizzle;
});

//# sourceMappingURL=drizzle.js.map