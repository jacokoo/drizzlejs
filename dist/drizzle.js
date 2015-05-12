
/*!
 * DrizzleJS v0.2.8
 * -------------------------------------
 * Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */
var slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(root, factory) {
  var Handlebars, diffDOM;
  if (typeof define === 'function' && define.amd) {
    return define(['handlebars.runtime', 'diff-dom'], function(Handlebars, diffDOM) {
      return factory(root, Handlebars['default'], diffDOM);
    });
  } else if (module && module.exports) {
    Handlebars = require('handlebars.runtime');
    diffDOM = require('diff-dom');
    return module.exports = factory(root, Handlebars, diffDOM);
  } else {
    return root.Drizzle = factory(root, Handlebars, diffDOM);
  }
})(this, function(root, Handlebars, diffDOM) {
  var A, Application, Base, D, Drizzle, Layout, Loader, Model, Module, Promise, Region, Route, Router, SimpleLoader, View, compose, defaultOptions, fn1, idCounter, item, j, len, pushStateSupported, toString, types;
  D = Drizzle = {
    version: '0.2.8'
  };
  idCounter = 0;
  toString = Object.prototype.toString;
  types = ['Function', 'Object', 'String', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'];
  compose = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return args.join('/').replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '');
  };
  fn1 = function(item) {
    return D["is" + item] = function(obj) {
      return toString.call(obj) === ("[object " + item + "]");
    };
  };
  for (j = 0, len = types.length; j < len; j++) {
    item = types[j];
    fn1(item);
  }
  D.extend = function() {
    var k, key, len1, mixin, mixins, target, value;
    target = arguments[0], mixins = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (!target) {
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
  D.include = function() {
    var k, key, len1, mixin, mixins, target, value;
    target = arguments[0], mixins = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (!D.isFunction(target)) {
      return target;
    }
    for (k = 0, len1 = mixins.length; k < len1; k++) {
      mixin = mixins[k];
      for (key in mixin) {
        value = mixin[key];
        target.prototype[key] = value;
      }
    }
    return target;
  };
  D.uniqueId = function(prefix) {
    return (prefix ? prefix : '') + ++idCounter;
  };
  A = D.Adapter = {
    Promise: root['Promise'],
    ajax: null,
    hasClass: function(el, clazz) {
      return $(el).hasClass(clazz);
    },
    getElementsBySelector: function(selector, el) {
      if (el == null) {
        el = root.document;
      }
      return el.querySelectorAll(selector);
    },
    delegateDomEvent: function(el, name, selector, fn) {
      return $(el).on(name, selector, fn);
    },
    undelegateDomEvents: function(el, namespace) {
      return $(el).off(namespace);
    }
  };
  D.Promise = Promise = (function() {
    function Promise(context1) {
      this.context = context1;
    }

    Promise.prototype.create = function(fn) {
      return new A.Promise((function(_this) {
        return function(resolve, reject) {
          return fn.call(_this.context, resolve, reject);
        };
      })(this));
    };

    Promise.prototype.resolve = function(obj) {
      return A.Promise.resolve(obj);
    };

    Promise.prototype.reject = function(obj) {
      return A.Promise.reject(obj);
    };

    Promise.prototype.when = function() {
      var args, obj;
      obj = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (D.isFunction(obj)) {
        obj = obj.apply(this.context, args);
      }
      return A.Promise.resolve(obj);
    };

    Promise.prototype.chain = function() {
      var rings;
      rings = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (rings.length === 0) {
        return this.resolve();
      }
      return this.create((function(_this) {
        return function(resolve, reject) {
          var doRing, prev;
          prev = null;
          doRing = function(ring, i) {
            var isArray, promises;
            isArray = D.isArray(ring);
            return (isArray ? (promises = (function() {
              var k, len1, results;
              results = [];
              for (k = 0, len1 = ring.length; k < len1; k++) {
                item = ring[k];
                results.push(this.when.apply(this, (i > 0 ? [item, prev] : [item])));
              }
              return results;
            }).call(_this), A.Promise.all(promises)) : _this.when.apply(_this, (i > 0 ? [ring, prev] : [ring]))).then(function(data) {
              prev = data;
              if (rings.length === 0) {
                return resolve(prev);
              } else {
                return doRing(rings.shift(), ++i);
              }
            }, function(data) {
              return reject(data);
            });
          };
          return doRing(rings.shift(), 0);
        };
      })(this));
    };

    return Promise;

  })();
  D.Event = {
    on: function(name, callback, context) {
      var base1;
      this.events || (this.events = {});
      ((base1 = this.events)[name] || (base1[name] = [])).push({
        fn: callback,
        ctx: context
      });
      return this;
    },
    off: function(name, callback, context) {
      if (!this.events) {
        return this;
      }
      if (!name) {
        return (this.events = {}) && this;
      }
      if (!this.events[name]) {
        return this;
      }
      if (!callback) {
        return (delete this.events[name]) && this;
      }
      this.events[name] = (function() {
        var k, len1, ref, results;
        ref = this.events[name];
        results = [];
        for (k = 0, len1 = ref.length; k < len1; k++) {
          item = ref[k];
          if (item.fn !== callback || (context && context !== item.ctx)) {
            results.push(item);
          }
        }
        return results;
      }).call(this);
      if (this.events[name].length === 0) {
        delete this.events[name];
      }
      return this;
    },
    trigger: function() {
      var args, k, len1, name, ref;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!(this.events && this.events[name])) {
        return this;
      }
      ref = this.events[name];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        item = ref[k];
        item.fn.apply(item.context, args);
      }
      return this;
    },
    delegateEvent: function(target) {
      var id;
      id = "--" + target.id;
      D.extend(target, {
        on: (function(_this) {
          return function(name, callback) {
            return target.listenTo(_this, name + id, callback);
          };
        })(this),
        off: (function(_this) {
          return function(name, callback) {
            return target.stopListening(_this, name && name + id, callback);
          };
        })(this),
        trigger: (function(_this) {
          return function() {
            var args, name;
            name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            args.unshift(name + id);
            _this.trigger.apply(_this, args);
            return target;
          };
        })(this),
        listenTo: function(obj, name, callback) {
          var base1;
          this.listeners || (this.listeners = {});
          ((base1 = this.listeners)[name] || (base1[name] = [])).push({
            fn: callback,
            obj: obj
          });
          obj.on(name, callback, this);
          return this;
        },
        stopListening: function(obj, name, callback) {
          var k, key, l, len1, len2, ref, ref1, value;
          if (!this.listeners) {
            return this;
          }
          if (!obj) {
            ref = this.listeners;
            for (key in ref) {
              value = ref[key];
              for (k = 0, len1 = value.length; k < len1; k++) {
                item = value[k];
                item.obj.off(key, item.fn, this);
              }
            }
            this.listeners = {};
            return this;
          }
          ref1 = this.listeners;
          for (key in ref1) {
            value = ref1[key];
            if (!(!name || name === key)) {
              continue;
            }
            this.listeners[key] = [];
            for (l = 0, len2 = value.length; l < len2; l++) {
              item = value[l];
              if (item.obj !== obj || (callback && callback !== item.fn)) {
                this.listeners[key].push(item);
              } else {
                item.obj.off(key, item.fn, this);
              }
            }
            if (this.listeners[key].length === 0) {
              delete this.listeners[key];
            }
          }
          return this;
        }
      });
      return this;
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
      return compose.apply(null, urls);
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
      return model.Promise.chain(A.ajax(params), function(resp) {
        model.set(resp);
        return model;
      });
    }
  };
  D.Factory = {
    types: {},
    register: function(type, clazz) {
      return this.types[type] = clazz;
    },
    create: function() {
      var args, clazz, type;
      type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      clazz = this.types[type] || this;
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(clazz, args, function(){});
    }
  };
  D.Base = Base = (function() {
    function Base(idPrefix, options1) {
      this.options = options1 != null ? options1 : {};
      this.id = D.uniqueId(idPrefix);
      this.Promise = new D.Promise(this);
      this.initialize();
    }

    Base.prototype.initialize = function() {};

    Base.prototype.getOptionValue = function(key) {
      var value;
      value = this.options[key];
      if (D.isFunction(value)) {
        return value.apply(this);
      } else {
        return value;
      }
    };

    Base.prototype.error = function(message) {
      var msg;
      if (!D.isString(message)) {
        throw message;
      }
      msg = this.module ? "[" + this.module.name + ":" : '[';
      msg += this.name + "] " + message;
      throw new Error(msg);
    };

    Base.prototype.extend = function(mixins) {
      var doExtend, key, results, value;
      if (!mixins) {
        return;
      }
      doExtend = (function(_this) {
        return function(key, value) {
          var old;
          if (D.isFunction(value)) {
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
  defaultOptions = {
    scriptRoot: 'app',
    urlRoot: '',
    urlSuffix: '',
    caseSensitiveHash: false,
    defaultRegion: root.document.body,
    attributesReferToId: ['for', 'data-target', 'data-parent'],
    fileNames: {
      module: 'index',
      templates: 'templates',
      view: 'view-',
      template: 'template-',
      router: 'router'
    },
    actionPromised: function(promise) {}
  };
  D.Application = Application = (function(superClass) {
    extend(Application, superClass);

    function Application(options) {
      var opt;
      if (options == null) {
        options = {};
      }
      opt = D.extend({}, defaultOptions, options);
      this.modules = {};
      this.global = {};
      this.loaders = {};
      this.regions = [];
      Application.__super__.constructor.call(this, 'A', opt);
    }

    Application.prototype.initialize = function() {
      var key, ref, value;
      this.registerLoader(new D.SimpleLoader(this));
      this.registerLoader(new D.Loader(this), true);
      ref = D.Helpers;
      for (key in ref) {
        value = ref[key];
        this.registerHelper(key, value);
      }
      return this.setRegion(new D.Region(this, null, this.options.defaultRegion));
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

    Application.prototype.load = function() {
      var name, names;
      names = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.Promise.chain((function() {
        var k, len1, results;
        results = [];
        for (k = 0, len1 = names.length; k < len1; k++) {
          name = names[k];
          results.push(this.getLoader(name).loadModule(name));
        }
        return results;
      }).call(this));
    };

    Application.prototype.show = function(name, options) {
      return this.region.show(name, options);
    };

    Application.prototype.destory = function() {
      var region;
      this.Promise.chain((function() {
        var k, len1, ref, results;
        ref = this.regions;
        results = [];
        for (k = 0, len1 = ref.length; k < len1; k++) {
          region = ref[k];
          results.push(region.close());
        }
        return results;
      }).call(this));
      return this.off();
    };

    Application.prototype.startRoute = function() {
      var defaultPath, paths, ref;
      defaultPath = arguments[0], paths = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!this.router) {
        this.router = new D.Router(this);
      }
      return this.Promise.chain((ref = this.router).mountRoutes.apply(ref, paths), function() {
        return this.router.start(defaultPath);
      });
    };

    Application.prototype.navigate = function(path, trigger) {
      return this.router.navigate(path, trigger);
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
  D.include(Application, D.Event);
  D.Model = Model = (function(superClass) {
    extend(Model, superClass);

    function Model(app1, module1, options) {
      this.app = app1;
      this.module = module1;
      if (options == null) {
        options = {};
      }
      this.data = options.data || {};
      this.params = D.extend({}, options.params);
      Model.__super__.constructor.call(this, 'D', options);
      this.app.delegateEvent(this);
    }

    Model.prototype.url = function() {
      return this.getOptionValue('url') || '';
    };

    Model.prototype.getFullUrl = function() {
      return D.Request.url(this);
    };

    Model.prototype.getParams = function() {
      return D.extend({}, this.params);
    };

    Model.prototype.set = function(data) {
      var d;
      d = D.isFunction(this.options.parse) ? this.options.parse.call(this, data) : data;
      this.data = this.options.root ? d[this.options.root] : d;
      this.changed();
      return this;
    };

    Model.prototype.changed = function() {
      return this.trigger('change');
    };

    Model.prototype.append = function(data) {
      if (D.isObject(this.data)) {
        D.extend(this.data, data);
      } else if (D.isArray(this.data)) {
        this.data = this.data.concat(D.isArray(data) ? data : [data]);
      }
      this.changed();
      return this;
    };

    Model.prototype.clear = function() {
      this.data = {};
      this.changed();
      return this;
    };

    Model.prototype.find = function(name, value) {
      var k, len1, ref, results;
      if (D.isObject(this.data)) {
        return this.data[name];
      }
      ref = this.data;
      results = [];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        item = ref[k];
        if (item[name] === value) {
          results.push(item);
        }
      }
      return results;
    };

    Model.prototype.findOne = function(name, value) {
      var result;
      result = this.find(name, value);
      if (!result) {
        return result;
      }
      if (D.isObject(this.data)) {
        return result;
      } else {
        return result[0];
      }
    };

    return Model;

  })(D.Base);
  D.Region = Region = (function(superClass) {
    extend(Region, superClass);

    function Region(app1, module1, el1, name1) {
      this.app = app1;
      this.module = module1;
      this.el = el1;
      this.name = name1 != null ? name1 : 'region';
      if (!this.el) {
        this.error('The DOM element for region is not found');
      }
      this.dd = new diffDOM();
      Region.__super__.constructor.call(this, 'R');
    }

    Region.prototype.isCurrent = function(item) {
      if (!this.current) {
        return false;
      }
      if (D.isObject(item) && item.id === this.current.id) {
        return true;
      }
      if (D.isString(item) && D.Loader.analyse(item).name === this.current.name) {
        return true;
      }
      return false;
    };

    Region.prototype.show = function(item, options) {
      if (options == null) {
        options = {};
      }
      if (this.isCurrent(item)) {
        if (options.forceRender === false) {
          return this.Promise.resolve(this.current);
        }
        return this.Promise.chain(this.current.render(options), this.current);
      }
      if (D.isString(item)) {
        item = this.app.getLoader(item).loadModule(item);
      }
      return this.Promise.chain(item, function(obj) {
        if (!(obj.render && obj.setRegion)) {
          this.error("Can not render " + obj);
        }
        return obj;
      }, [
        function(obj) {
          return this.Promise.chain(function() {
            if (obj.region) {
              return obj.region.close();
            }
          }, obj);
        }, function() {
          return this.close();
        }
      ], function(arg) {
        var obj;
        obj = arg[0];
        this.current = obj;
        return this.Promise.chain(obj.setRegion(this), obj);
      }, function(obj) {
        return obj.render(options);
      });
    };

    Region.prototype.close = function() {
      return this.Promise.chain(function() {
        if (this.current) {
          return this.current.close();
        }
      }, function() {
        delete this.current;
        return this;
      });
    };

    Region.prototype.getEl = function() {
      return this.el;
    };

    Region.prototype.$$ = function(selector) {
      return A.getElementsBySelector(selector, this.el);
    };

    Region.prototype.update = function(el) {
      return this.dd.apply(this.el, this.dd.diff(this.el, el));
    };

    Region.prototype.empty = function() {
      return this.el.innerHTML = '';
    };

    Region.prototype.delegateDomEvent = function(item, name, selector, fn) {
      var n;
      n = name + ".events" + this.id + item.id;
      return A.delegateDomEvent(this.el, n, selector, fn);
    };

    Region.prototype.undelegateDomEvents = function(item) {
      return A.undelegateDomEvents(this.el, ".events" + this.id + item.id);
    };

    return Region;

  })(D.Base);
  D.extend(D.Region, D.Factory);
  D.View = View = (function(superClass) {
    extend(View, superClass);

    View.ComponentManager = {
      handlers: {},
      componentCache: {},
      createDefaultHandler: function(name) {
        return {
          creator: function(view, el, options) {
            return el[name](options);
          },
          destructor: function(view, component, options) {
            return component[name]('destroy');
          }
        };
      },
      register: function(name, creator, destructor) {
        if (destructor == null) {
          destructor = (function() {});
        }
        return this.handlers[name] = {
          creator: creator,
          destructor: destructor
        };
      },
      create: function(view, options) {
        var dom, handler, id, name, opt, selector;
        if (options == null) {
          options = {};
        }
        id = options.id, name = options.name, selector = options.selector, opt = options.options;
        if (!name) {
          view.error('Component name can not be null');
        }
        if (!(this.handlers[name] || el[name])) {
          view.error('No component handler for name:' + name);
        }
        handler = this.handlers[name] || createDefaultHandler(name);
        dom = selector ? view.$$(selector) : view.$(id);
        if (dom.size() === 0 && !selector) {
          dom = view.getEl();
        }
        if (!id) {
          id = D.uniqueId();
        }
        return view.Promise.chain(handler.creator(view, dom, opt), function(comp) {
          componentCache[view.id + id] = {
            handler: handler,
            id: id,
            options: opt
          };
          return {
            id: id,
            component: comp
          };
        });
      },
      destroy: function(id, view, component) {
        var base1, info;
        info = this.componentCache[view.id + id];
        delete this.componentCache[view.id + id];
        return typeof (base1 = info.handler).destructor === "function" ? base1.destructor(view, component, info.options) : void 0;
      }
    };

    function View(name1, module1, loader1, options) {
      this.name = name1;
      this.module = module1;
      this.loader = loader1;
      if (options == null) {
        options = {};
      }
      this.app = this.module.app;
      this.eventHandlers = options.handlers || {};
      this.components = {};
      View.__super__.constructor.call(this, 'V', options);
      this.app.delegateEvent(this);
    }

    View.prototype.initialize = function() {
      if (this.options.extend) {
        this.extend(this.options.extend);
      }
      return this.loadedPromise = this.Promise.chain([this.loadTemplate(), this.bindData()]);
    };

    View.prototype.loadTemplate = function() {
      var template;
      if (this.module.separatedTemplate !== true) {
        return this.Promise.chain(this.module.loadedPromise, function() {
          return this.template = this.module.template;
        });
      } else {
        template = this.getOptionValue('template') || this.name;
        return this.Promise.chain(this.app.getLoader(template).loadSeparatedTemplate(this, template), function(t) {
          return this.template = t;
        });
      }
    };

    View.prototype.bindData = function() {
      return this.Promise.chain(this.module.loadedPromise, function() {
        var bind, doBind, key, model, results, value;
        bind = this.getOptionValue('bind') || {};
        this.data = {};
        doBind = (function(_this) {
          return function(model) {
            return _this.listenTo(model, 'change', function() {
              return _this.render(_this.renderOptions);
            });
          };
        })(this);
        results = [];
        for (key in bind) {
          value = bind[key];
          model = this.data[key] = this.module.store[key];
          if (!model) {
            this.error("No model: " + key);
          }
          if (value === true) {
            results.push(doBind(model));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    };

    View.prototype.unbindData = function() {
      this.stopListening();
      return delete this.data;
    };

    View.prototype.getEl = function() {
      if (this.region) {
        return this.region.getEl(this);
      } else {
        return null;
      }
    };

    View.prototype.$ = function(id) {
      return this.$$("#" + (this.wrapDomId(id)))[0];
    };

    View.prototype.$$ = function(selector) {
      return this.region.$$(selector);
    };

    View.prototype.setRegion = function(region1) {
      this.region = region1;
      this.virtualEl = this.getEl(this).cloneNode();
      return this.bindEvents();
    };

    View.prototype.close = function() {
      if (!this.region) {
        return this.Promise.resolve(this);
      }
      return this.Promise.chain(function() {
        var ref;
        return (ref = this.options.beforeClose) != null ? ref.call(this) : void 0;
      }, this.beforeClose, [
        this.unbindEvents, this.unbindData, this.destroyComponents, function() {
          return this.region.empty(this);
        }
      ], function() {
        var ref;
        return (ref = this.options.afterClose) != null ? ref.call(this) : void 0;
      }, this.afterClose, function() {
        return delete this.region;
      }, this);
    };

    View.prototype.wrapDomId = function(id) {
      return "" + this.id + id;
    };

    View.prototype.bindEvents = function() {
      var events, key, me, results, value;
      me = this;
      events = this.getOptionValue('events') || {};
      results = [];
      for (key in events) {
        value = events[key];
        if (D.isString(value)) {
          results.push((function(_this) {
            return function(key, value) {
              var handler, id, name, ref, selector, star, wid;
              ref = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/), name = ref[0], id = ref[1];
              if (!_this.eventHandlers[value]) {
                _this.error("No event handler: " + value);
              }
              if (!id) {
                _this.error('Id is required');
              }
              star = id.slice(-1) === '*';
              wid = _this.wrapDomId(star ? id.slice(0, -1) : id);
              selector = star ? "[id^=" + wid + "]" : '#' + wid;
              handler = function(e) {
                var args, target;
                target = e.target || e.srcElement;
                if (A.hasClass(target, 'disabled')) {
                  return;
                }
                args = [e];
                if (star) {
                  args.unshift(target.getAttribute('id').slice(wid.length));
                }
                return me.eventHandlers[value].apply(me, args);
              };
              return _this.region.delegateDomEvent(_this, name, selector, handler);
            };
          })(this)(key, value));
        }
      }
      return results;
    };

    View.prototype.unbindEvents = function() {
      return this.region.undelegateDomEvents(this);
    };

    View.prototype.render = function(options) {
      if (options == null) {
        options = {};
      }
      if (!this.region) {
        this.error('No region');
      }
      this.renderOptions = options;
      return this.Promise.chain(this.loadedPromise, this.destroyComponents, function() {
        var ref;
        return (ref = this.options.beforeRender) != null ? ref.call(this) : void 0;
      }, this.beforeRender, this.serializeData, this.renderTemplate, this.renderComponent, this.afterRender, function() {
        var ref;
        return (ref = this.options.afterRender) != null ? ref.call(this) : void 0;
      }, this);
    };

    View.prototype.serializeData = function() {
      var adjusts, data, key, ref, value;
      data = {};
      ref = this.data;
      for (key in ref) {
        value = ref[key];
        data[key] = value.data;
      }
      adjusts = this.getOptionValue('dataForTemplate') || {};
      for (key in adjusts) {
        value = adjusts[key];
        data[key] = value.call(this, data);
      }
      data.Global = this.app.global;
      data.View = this;
      return data;
    };

    View.prototype.renderTemplate = function(data) {
      var attr, id, k, l, len1, len2, len3, m, ref, ref1, ref2, used, value, withHash;
      this.virtualEl.innerHTML = this.template(data);
      used = {};
      ref = A.getElementsBySelector('[id]', this.virtualEl);
      for (k = 0, len1 = ref.length; k < len1; k++) {
        item = ref[k];
        id = item.getAttribute('id');
        if (used[id]) {
          this.error(id + " already used");
        }
        used[id] = true;
        item.setAttribute('id', this.wrapDomId(id));
      }
      ref1 = this.app.options.attributesReferToId || [];
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        attr = ref1[l];
        ref2 = A.getElementsBySelector("[" + attr + "]", this.virtualEl);
        for (m = 0, len3 = ref2.length; m < len3; m++) {
          item = ref2[m];
          value = item.getAttribute(attr);
          withHash = value.charAt(0) === '#';
          item.setAttribute(attr, (withHash ? "#" + (this.wrapDomId(value.slice(1))) : this.wrapDomId(value)));
        }
      }
      return this.region.update(this.virtualEl);
    };

    View.prototype.renderComponent = function() {
      var component, components, promises;
      components = this.getOptionValue('components') || [];
      promises = (function() {
        var k, len1, results;
        results = [];
        for (k = 0, len1 = components.length; k < len1; k++) {
          component = components[k];
          if (D.isFunction(component)) {
            component = component.apply(this);
          }
          if (component) {
            results.push(View.ComponentManager.create(this, component));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }).call(this);
      return this.Promise.chain(promises, (function(_this) {
        return function(comps) {
          var id, k, len1, ref, results;
          results = [];
          for (k = 0, len1 = comps.length; k < len1; k++) {
            ref = comps[k], id = ref.id, component = ref.component;
            if (comp) {
              results.push(_this.components[id] = component);
            }
          }
          return results;
        };
      })(this));
    };

    View.prototype.destroyComponents = function() {
      var key, ref, value;
      ref = this.components || {};
      for (key in ref) {
        value = ref[key];
        View.ComponentManager.destroy(key, this, value);
      }
      return this.components = {};
    };

    View.prototype.beforeRender = function() {};

    View.prototype.afterRender = function() {};

    View.prototype.beforeClose = function() {};

    View.prototype.afterClose = function() {};

    return View;

  })(Base);
  Layout = (function(superClass) {
    extend(Layout, superClass);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      this.isLayout = true;
      return this.loadedPromise = this.loadTemplate();
    };

    return Layout;

  })(D.View);
  D.Module = Module = (function(superClass) {
    extend(Module, superClass);

    Module.Layout = Layout;

    function Module(name1, app1, loader1, options) {
      this.name = name1;
      this.app = app1;
      this.loader = loader1;
      if (options == null) {
        options = {};
      }
      this.separatedTemplate = options.separatedTemplate === true;
      this.regions = {};
      Module.__super__.constructor.call(this, 'M', options);
      this.app.modules[this.id] = this;
      this.app.delegateEvent(this);
    }

    Module.prototype.initialize = function() {
      if (this.options.extend) {
        this.extend(this.options.extend);
      }
      this.loadedPromise = this.Promise.chain([this.loadTemplate(), this.loadItems()]);
      this.initLayout();
      return this.initStore();
    };

    Module.prototype.initLayout = function() {
      var layout;
      layout = this.getOptionValue('layout') || {};
      return this.layout = new Layout('layout', this, this.loader, layout);
    };

    Module.prototype.initStore = function() {
      var doItem, key, ref, results, value;
      this.store = {};
      this.autoLoadBeforeRender = [];
      this.autoLoadAfterRender = [];
      doItem = (function(_this) {
        return function(name, value) {
          if (D.isFunction(value)) {
            value = value.call(_this);
          }
          if (value && value.autoLoad) {
            (value.autoLoad === true ? _this.autoLoadBeforeRender : _this.autoLoadAfterRender).push(name);
          }
          return _this.store[name] = new D.Model(_this.app, _this, value);
        };
      })(this);
      ref = this.getOptionValue('store') || {};
      results = [];
      for (key in ref) {
        value = ref[key];
        results.push(doItem(key, value));
      }
      return results;
    };

    Module.prototype.loadTemplate = function() {
      if (this.separatedTemplate) {
        return;
      }
      return this.Promise.chain(this.loader.loadTemplate(this), function(template) {
        return this.template = template;
      });
    };

    Module.prototype.loadItems = function() {
      var doItem, key, value;
      this.items = {};
      this.inRegionItems = {};
      doItem = (function(_this) {
        return function(name, options) {
          var method;
          if (D.isFunction(options)) {
            options = options.call(_this);
          }
          if (D.isString(options)) {
            options = {
              region: options
            };
          }
          method = options.isModule ? 'loadModule' : 'loadView';
          return _this.Promise.chain(_this.app.getLoader(name)[method](name, _this, options), function(obj) {
            obj.moduleOptions = options;
            this.items[name] = obj;
            if (options.region) {
              return this.inRegionItems[name] = obj;
            }
          });
        };
      })(this);
      return this.Promise.chain((function() {
        var ref, results;
        ref = this.getOptionValue('items') || {};
        results = [];
        for (key in ref) {
          value = ref[key];
          results.push(doItem(key, value));
        }
        return results;
      }).call(this));
    };

    Module.prototype.setRegion = function(region1) {
      this.region = region1;
      return this.Promise.chain(function() {
        return this.layout.setRegion(this.region);
      }, function() {
        return this.layout.render();
      }, this.initRegions);
    };

    Module.prototype.close = function() {
      return this.Promise.chain(function() {
        var ref;
        return (ref = this.options.beforeClose) != null ? ref.call(this) : void 0;
      }, this.beforeClose, function() {
        return this.layout.close();
      }, this.closeRegions, this.afterClose, function() {
        var ref;
        return (ref = this.options.afterClose) != null ? ref.call(this) : void 0;
      }, function() {
        return delete this.app.modules[this.id];
      }, this);
    };

    Module.prototype.render = function(options) {
      if (options == null) {
        options = {};
      }
      if (!this.region) {
        this.error('No region');
      }
      this.renderOptions = options;
      return this.Promise.chain(this.loadedPromise, function() {
        var ref;
        return (ref = this.options.beforeRender) != null ? ref.call(this) : void 0;
      }, this.beforeRender, this.fetchDataBeforeRender, this.renderItems, this.afterRender, function() {
        var ref;
        return (ref = this.options.afterRender) != null ? ref.call(this) : void 0;
      }, this.fetchDataAfterRender, this);
    };

    Module.prototype.closeRegions = function() {
      var key, ref, regions, results, value;
      regions = this.regions;
      delete this.regions;
      ref = regions || {};
      results = [];
      for (key in ref) {
        value = ref[key];
        results.push(value.close());
      }
      return results;
    };

    Module.prototype.initRegions = function() {
      var id, k, len1, ref, results, type;
      if (this.regions) {
        this.closeRegions();
      }
      this.regions = {};
      ref = this.layout.$$('[data-region]');
      results = [];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        item = ref[k];
        id = item.getAttribute('data-region');
        type = item.getAttribute('region-type');
        results.push(this.regions[id] = D.Region.create(type, this.app, this, item, id));
      }
      return results;
    };

    Module.prototype.renderItems = function() {
      var key, ref, results, value;
      ref = this.inRegionItems;
      results = [];
      for (key in ref) {
        value = ref[key];
        if (!this.regions[key]) {
          this.error("Region:" + key + " is not defined");
        }
        results.push(this.regions[key].show(value));
      }
      return results;
    };

    Module.prototype.fetchDataBeforeRender = function() {
      var name;
      return this.Promise.chain((function() {
        var k, len1, ref, results;
        ref = this.autoLoadBeforeRender;
        results = [];
        for (k = 0, len1 = ref.length; k < len1; k++) {
          name = ref[k];
          results.push(D.Request.get(this.store[name]));
        }
        return results;
      }).call(this));
    };

    Module.prototype.fetchDataAfterRender = function() {
      var name;
      return this.Promise.chain((function() {
        var k, len1, ref, results;
        ref = this.autoLoadAfterRender;
        results = [];
        for (k = 0, len1 = ref.length; k < len1; k++) {
          name = ref[k];
          results.push(D.Request.get(this.store[name]));
        }
        return results;
      }).call(this));
    };

    Module.prototype.beforeRender = function() {};

    Module.prototype.afterRender = function() {};

    Module.prototype.beforeClose = function() {};

    Module.prototype.afterClose = function() {};

    return Module;

  })(D.Base);
  D.Loader = Loader = (function(superClass) {
    extend(Loader, superClass);

    Loader.analyse = function(name) {
      var args, loaderName, ref;
      if (!D.isString(name)) {
        return {
          loader: null,
          name: name
        };
      }
      ref = name.split(':'), loaderName = ref[0], name = ref[1], args = 3 <= ref.length ? slice.call(ref, 2) : [];
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
      Loader.__super__.constructor.call(this, 'L');
    }

    Loader.prototype.loadResource = function(path) {
      path = this.app.options.scriptRoot + '/' + path;
      return this.Promise.create(function(resolve, reject) {
        var error;
        if (this.app.options.amd) {
          error = function(e) {
            var ref;
            if (((ref = e.requireModules) != null ? ref[0] : void 0) === path) {
              define(path, null);
              require.undef(path);
              require([path], function() {});
              return resolve(null);
            } else {
              reject(null);
              throw e;
            }
          };
          return require([path], function(obj) {
            return resolve(obj);
          }, error);
        } else {
          return resolve(require(path));
        }
      });
    };

    Loader.prototype.loadModuleResource = function(module, path) {
      return this.loadResource(module.name + '/' + path);
    };

    Loader.prototype.loadModule = function(path, parent) {
      var name;
      name = Loader.analyse(path).name;
      return this.Promise.chain(this.loadResource(name + '/' + this.fileNames.module), (function(_this) {
        return function(options) {
          var module;
          module = new D.Module(name, _this.app, _this, options);
          if (parent) {
            module.module = parent;
          }
          return module;
        };
      })(this));
    };

    Loader.prototype.loadView = function(name, module, options) {
      name = Loader.analyse(name).name;
      return this.Promise.chain(this.loadModuleResource(module, this.fileNames.view + name), (function(_this) {
        return function(options) {
          return new D.View(name, module, _this, options);
        };
      })(this));
    };

    Loader.prototype.loadTemplate = function(module) {
      return this.loadModuleResource(module, this.fileNames.templates);
    };

    Loader.prototype.loadSeparatedTemplate = function(view, name) {
      return this.loadModuleResource(module, this.fileNames.template + name);
    };

    Loader.prototype.loadRouter = function(path) {
      var name;
      name = Loader.analyse(path).name;
      path = name + '/' + this.fileNames.router;
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
      return this.Promise.resolve(module);
    };

    SimpleLoader.prototype.loadView = function(name, module, item) {
      name = Loader.analyse(name).name;
      return this.Promise.resolve(new D.View(name, module, this, {}));
    };

    return SimpleLoader;

  })(D.Loader);
  pushStateSupported = root.history && 'pushState' in root.history;
  Route = (function() {
    Route.prototype.regExps = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

    function Route(app1, router1, path1, fn2) {
      var pattern;
      this.app = app1;
      this.router = router1;
      this.path = path1;
      this.fn = fn2;
      pattern = this.path.replace(this.regExps[0], this.regExps[1]).replace(this.regExps[2], this.regExps[3]);
      this.pattern = new RegExp("^" + pattern + "$", this.app.options.caseSensitiveHash ? 'g' : 'gi');
    }

    Route.prototype.match = function(hash) {
      this.pattern.lastIndex = 0;
      return this.pattern.test(hash);
    };

    Route.prototype.handle = function(hash) {
      var args, fns, handlers, i, ref, route;
      this.pattern.lastIndex = 0;
      args = this.pattern.exec(hash).slice(1);
      handlers = this.router.getInterceptors(this.path);
      handlers.push(this.fn);
      fns = (function() {
        var k, len1, results;
        results = [];
        for (i = k = 0, len1 = handlers.length; k < len1; i = ++k) {
          route = handlers[i];
          results.push((function(_this) {
            return function(route, i) {
              return function(prev) {
                return route.apply(_this.router, (i > 0 ? [prev].concat(args) : args));
              };
            };
          })(this)(route, i));
        }
        return results;
      }).call(this);
      return (ref = this.router.Promise).chain.apply(ref, fns);
    };

    return Route;

  })();
  D.Router = Router = (function(superClass) {
    extend(Router, superClass);

    function Router(app1) {
      this.app = app1;
      this.routes = [];
      this.routeMap = {};
      this.interceptors = {};
      this.started = false;
      Router.__super__.constructor.call(this, 'R');
    }

    Router.prototype.initialize = function() {
      return this.addRoute('/', this.app.options.defaultRouter || {});
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
      A.delegateDomEvent(root, key, null, (function(_this) {
        return function() {
          return _this.dispatch(_this.getHash());
        };
      })(this));
      if (hash = this.getHash()) {
        return this.navigate(hash);
      } else if (defaultPath) {
        return this.navigate(defaultPath);
      }
    };

    Router.prototype.stop = function() {
      A.undelegateDomEvents(root, '.dr');
      return this.started = false;
    };

    Router.prototype.dispatch = function(hash) {
      var k, len1, ref, route;
      if (this.previousHash === hash) {
        return;
      }
      this.previousHash = hash;
      ref = this.routes;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        route = ref[k];
        if (route.match(hash)) {
          return route.handle(hash);
        }
      }
    };

    Router.prototype.navigate = function(path, trigger) {
      if (trigger == null) {
        trigger = true;
      }
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
      return this.Promise.chain((function() {
        var k, len1, results;
        results = [];
        for (k = 0, len1 = paths.length; k < len1; k++) {
          path = paths[k];
          results.push(this.app.getLoader(path).loadRouter(path));
        }
        return results;
      }).call(this), function(routers) {
        var i, k, len1, results, router;
        results = [];
        for (i = k = 0, len1 = routers.length; k < len1; i = ++k) {
          router = routers[i];
          results.push(this.addRoute(paths[i], router));
        }
        return results;
      });
    };

    Router.prototype.addRoute = function(path, router) {
      var interceptors, key, p, ref, ref1, results, routes, value;
      routes = router.routes, interceptors = router.interceptors;
      if (D.isFunction(routes)) {
        routes = routes.call(this);
      }
      if (D.isFunction(interceptors)) {
        interceptors = interceptors.call(this);
      }
      ref = interceptors || {};
      for (key in ref) {
        value = ref[key];
        this.interceptors[compose(path, key)] = value;
      }
      ref1 = routes || {};
      results = [];
      for (key in ref1) {
        value = ref1[key];
        p = compose(path, key);
        if (!D.isFunction(router[value])) {
          this.error('Route [' + p + '] is not defined');
        }
        results.push(this.routes.unshift(new Route(this.app, this, compose(path, key), router[value])));
      }
      return results;
    };

    Router.prototype.getInterceptors = function(path) {
      var items, key, result;
      result = this.interceptors[''] ? [this.interceptors['']] : [];
      items = path.split('/');
      while (items.length > 0) {
        key = items.join('/');
        if (this.interceptors[key]) {
          result.unshift(this.interceptors[key]);
        }
        items.pop();
      }
      return result;
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