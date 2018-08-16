(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.drizzlejs = factory());
}(this, (function () { 'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    var toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    var ValueType;
    (function (ValueType) {
        ValueType[ValueType["STATIC"] = 0] = "STATIC";
        ValueType[ValueType["DYNAMIC"] = 1] = "DYNAMIC";
    })(ValueType || (ValueType = {}));
    var ChangeType;
    (function (ChangeType) {
        ChangeType[ChangeType["CHANGED"] = 0] = "CHANGED";
        ChangeType[ChangeType["NOT_CHANGED"] = 1] = "NOT_CHANGED";
    })(ChangeType || (ChangeType = {}));
    function createAppendable(target) {
        if (!target) return null;
        var remove = function remove(el) {
            return target.removeChild(el);
        };
        var append = function append(el) {
            return target.appendChild(el);
        };
        var before = function before(anchor) {
            return { remove: remove, before: before, append: function append(el) {
                    return target.insertBefore(el, anchor);
                } };
        };
        return { append: append, remove: remove, before: before };
    }

    var Delay = function () {
        function Delay() {
            classCallCheck(this, Delay);

            this.busy = Promise.resolve();
        }

        createClass(Delay, [{
            key: "add",
            value: function add(p) {
                this.busy = this.busy.then(function () {
                    return p;
                });
            }
        }, {
            key: "execute",
            value: function execute() {
                return this.busy;
            }
        }], [{
            key: "also",
            value: function also(fn) {
                var d = new Delay();
                fn(d);
                return d.execute();
            }
        }]);
        return Delay;
    }();

    function getValue(key, context) {
        var ks = key.split('.');
        var first = ks.shift();
        var ctx = void 0;
        if (context._computed && first in context._computed) {
            ctx = context._computed[first](context);
        } else {
            ctx = context[first];
        }
        if (ks.length) {
            ctx = ks.reduce(function (acc, item) {
                if (acc == null) return null;
                return acc[item];
            }, ctx);
        }
        return ctx;
    }
    function getAttributeValue(attr, context) {
        if (attr[0] === ValueType.STATIC) return attr[1];
        return getValue(attr[1], context);
    }
    function resolveEventArgument(me, context, args, event) {
        var values = args.map(function (_ref) {
            var _ref2 = slicedToArray(_ref, 2),
                name = _ref2[0],
                v = _ref2[1];

            if (v[0] === ValueType.STATIC) return v[1];
            var it = v[1];
            if (it === 'event') return event;
            if (it === 'this') return me;
            if (it.slice(0, 6) === 'event.') return event[it.slice(6)];
            if (it.slice(0, 5) === 'this.') return me[it.slice(5)];
            return getValue(it, context);
        });
        var obj = {};
        var result = [obj];
        var keys = 0;
        args.forEach(function (_ref3, i) {
            var _ref4 = slicedToArray(_ref3, 2),
                name = _ref4[0],
                v = _ref4[1];

            if (name) {
                keys++;
                obj[name] = values[i];
                return;
            }
            result.push(values[i]);
        });
        if (keys === 0) result.shift();
        return result;
    }
    var customEvents = {
        enter: function enter(node, cb) {
            var ee = function ee(e) {
                if (e.keyCode !== 13) return;
                e.preventDefault();
                cb.call(this, e);
            };
            node.addEventListener('keypress', ee, false);
            return {
                dispose: function dispose() {
                    node.removeEventListener('keypress', ee, false);
                }
            };
        },
        escape: function escape(node, cb) {
            var ee = function ee(e) {
                if (e.keyCode !== 27) return;
                cb.call(this, e);
            };
            node.addEventListener('keyup', ee, false);
            return {
                dispose: function dispose() {
                    node.removeEventListener('keyup', ee, false);
                }
            };
        }
    };
    var components = {};

    var Template = function () {
        function Template() {
            classCallCheck(this, Template);
        }

        createClass(Template, [{
            key: "init",
            value: function init(root, delay) {
                this.root = root;
                this.nodes = this.createor();
                this.nodes.forEach(function (it) {
                    return it.init(root, delay);
                });
            }
        }, {
            key: "render",
            value: function render(context, delay) {
                var _this = this;

                this.nodes.forEach(function (it) {
                    it.parent = _this.root._target;
                    it.render(context, delay);
                });
            }
        }, {
            key: "update",
            value: function update(context, delay) {
                this.nodes.forEach(function (it) {
                    return it.update(context, delay);
                });
            }
        }, {
            key: "destroy",
            value: function destroy(delay) {
                this.nodes.forEach(function (it) {
                    it.destroy(delay);
                    it.parent = null;
                });
            }
        }]);
        return Template;
    }();

    var Node = function () {
        function Node(id) {
            classCallCheck(this, Node);

            this.children = [];
            this.rendered = false;
            this.inSvg = false;
            this.id = id;
        }

        createClass(Node, [{
            key: 'init',
            value: function init(root, delay) {
                this.root = root;
                this.element = this.create();
                if (this.id && this.element) root.ids[this.id] = this.element;
                var a = createAppendable(this.element);
                this.children.forEach(function (it) {
                    it.parent = a;
                    it.init(root, delay);
                });
            }
        }, {
            key: 'render',
            value: function render(context, delay) {}
        }, {
            key: 'update',
            value: function update(context, delay) {}
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (this.id) delete this.root.ids[this.id];
                this.children.forEach(function (it) {
                    return it.destroy(delay);
                });
            }
        }, {
            key: 'setChildren',
            value: function setChildren(children) {
                this.children = children;
                if (this.inSvg) children.forEach(function (it) {
                    return it.setToSvg();
                });
            }
        }, {
            key: 'setToSvg',
            value: function setToSvg() {
                this.inSvg = true;
                this.children.forEach(function (it) {
                    return it.inSvg = true;
                });
            }
        }, {
            key: 'clearHelper',
            value: function clearHelper() {
                this.children.forEach(function (it) {
                    return it.clearHelper();
                });
            }
        }, {
            key: 'create',
            value: function create() {
                return null;
            }
        }]);
        return Node;
    }();

    var AnchorNode = function (_MNode) {
        inherits(AnchorNode, _MNode);

        function AnchorNode(id) {
            classCallCheck(this, AnchorNode);

            var _this = possibleConstructorReturn(this, (AnchorNode.__proto__ || Object.getPrototypeOf(AnchorNode)).call(this, id));

            _this.anchor = document.createComment('');
            return _this;
        }

        createClass(AnchorNode, [{
            key: 'render',
            value: function render(context, delay) {
                if (!this.newParent) {
                    this.parent.append(this.anchor);
                    this.newParent = this.parent.before(this.anchor);
                }
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                get(AnchorNode.prototype.__proto__ || Object.getPrototypeOf(AnchorNode.prototype), 'destroy', this).call(this, delay);
                this.parent.remove(this.anchor);
                this.newParent = null;
            }
        }]);
        return AnchorNode;
    }(Node);

    var Compare = {
        eq: function eq(v1, v2) {
            return v1 === v2;
        },
        ne: function ne(v1, v2) {
            return v1 !== v2;
        },
        gt: function gt(v1, v2) {
            return v1 > v2;
        },
        lt: function lt(v1, v2) {
            return v1 < v2;
        },
        gte: function gte(v1, v2) {
            return v1 >= v2;
        },
        lte: function lte(v1, v2) {
            return v1 <= v2;
        }
    };

    var IfBlock = function (_AnchorNode) {
        inherits(IfBlock, _AnchorNode);

        function IfBlock(args, trueNode, falseNode) {
            classCallCheck(this, IfBlock);

            var _this = possibleConstructorReturn(this, (IfBlock.__proto__ || Object.getPrototypeOf(IfBlock)).call(this));

            _this.trueNode = trueNode;
            _this.falseNode = falseNode;
            _this.args = args;
            return _this;
        }

        createClass(IfBlock, [{
            key: 'init',
            value: function init(root, delay) {
                this.root = root;
                this.trueNode.init(root, delay);
                if (this.falseNode) {
                    this.falseNode.init(root, delay);
                }
            }
        }, {
            key: 'use',
            value: function use(context) {
                if (this.args.length === 1) return this.useSingle(context);
                if (this.args.length === 3) return this.useCompare(context);
                throw new Error('if block should have 1 or 3 arguments');
            }
        }, {
            key: 'useCompare',
            value: function useCompare(context) {
                var op = this.args[1][1];
                if (!Compare[op]) {
                    throw Error(op + ' is not a valid compare operator, use: eq(===), ne(!==), gt(>), lt(<), gte(>=), lte(<=)');
                }
                return Compare[op](getAttributeValue(this.args[0], context), getAttributeValue(this.args[2], context));
            }
        }, {
            key: 'useSingle',
            value: function useSingle(context) {
                if (this.args[0][0] === ValueType.STATIC) {
                    // TODO throw
                    return false;
                }
                return !!getAttributeValue(this.args[0], context);
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                get(IfBlock.prototype.__proto__ || Object.getPrototypeOf(IfBlock.prototype), 'render', this).call(this, context, delay);
                this.trueNode.parent = this.newParent;
                if (this.falseNode) {
                    this.falseNode.parent = this.newParent;
                }
                this.current = this.use(context) ? this.trueNode : this.falseNode;
                if (this.current) {
                    this.current.render(context, delay);
                }
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                if (!this.rendered) return;
                var use = this.use(context) ? this.trueNode : this.falseNode;
                if (use === this.current) {
                    if (use) use.update(context, delay);
                    return;
                }
                if (this.current) this.current.destroy(delay);
                this.current = use === this.trueNode ? this.trueNode : this.falseNode;
                if (this.current) this.current.render(context, delay);
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (!this.rendered) return;
                if (this.current) this.current.destroy(delay);
                get(IfBlock.prototype.__proto__ || Object.getPrototypeOf(IfBlock.prototype), 'destroy', this).call(this, delay);
                this.rendered = false;
            }
        }]);
        return IfBlock;
    }(AnchorNode);

    var UnlessBlock = function (_IfBlock) {
        inherits(UnlessBlock, _IfBlock);

        function UnlessBlock() {
            classCallCheck(this, UnlessBlock);
            return possibleConstructorReturn(this, (UnlessBlock.__proto__ || Object.getPrototypeOf(UnlessBlock)).apply(this, arguments));
        }

        createClass(UnlessBlock, [{
            key: 'use',
            value: function use(context) {
                return !getAttributeValue(this.args[0], context);
            }
        }]);
        return UnlessBlock;
    }(IfBlock);

    var Helper = function () {
        function Helper() {
            classCallCheck(this, Helper);

            this.name = '';

            for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
                args[_key2] = arguments[_key2];
            }

            this.args = args;
            this.dynamicKeys = args.filter(function (it) {
                return it[0] === ValueType.DYNAMIC;
            }).map(function (it) {
                return it[1];
            });
            this.check();
        }

        createClass(Helper, [{
            key: 'clear',
            value: function clear() {
                this.currentValues = null;
            }
        }, {
            key: 'render',
            value: function render(context) {
                var _this = this;

                if (!this.currentValues) return [ChangeType.CHANGED, this.renderIt(context)];
                var vs = this.currentKeys.map(function (it) {
                    return getValue(it, context);
                }); // TODO if changed, will it do get value twice?
                if (vs.some(function (it, i) {
                    return it !== _this.currentValues[i];
                })) {
                    return [ChangeType.CHANGED, this.renderIt(context)];
                }
                return [ChangeType.NOT_CHANGED, this.current];
            }
        }, {
            key: 'arg',
            value: function arg(idx, context) {
                var arg = this.args[idx];
                if (!arg) return '';
                if (arg[0] === ValueType.STATIC) return arg[1];
                return this.key(arg[1], context);
            }
        }, {
            key: 'key',
            value: function key(_key, context) {
                this.currentKeys.push(_key);
                var v = getValue(_key, context);
                this.currentValues.push(v);
                return v;
            }
        }, {
            key: 'check',
            value: function check() {}
        }, {
            key: 'assertCount',
            value: function assertCount() {
                var _this2 = this;

                for (var _len2 = arguments.length, numbers = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
                    numbers[_key3] = arguments[_key3];
                }

                if (!numbers.some(function (it) {
                    return it === _this2.args.length;
                })) {
                    throw new Error(name + ' helper should have ' + numbers.join(' or ') + ' arguments');
                }
            }
        }, {
            key: 'assertDynamic',
            value: function assertDynamic() {
                var _this3 = this;

                for (var _len3 = arguments.length, numbers = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
                    numbers[_key4] = arguments[_key4];
                }

                numbers.forEach(function (it) {
                    if (_this3.args[it][0] !== ValueType.DYNAMIC) {
                        throw new Error('the ' + it + 'th argument of ' + name + ' helper should be dynamic');
                    }
                });
            }
        }, {
            key: 'renderIt',
            value: function renderIt(context) {
                this.currentKeys = [];
                this.currentValues = [];
                this.current = this.doRender(context);
                return this.current;
            }
        }]);
        return Helper;
    }();

    var Transfromer = function (_Helper) {
        inherits(Transfromer, _Helper);

        function Transfromer(fn) {
            var _ref;

            classCallCheck(this, Transfromer);

            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key5 = 1; _key5 < _len4; _key5++) {
                args[_key5 - 1] = arguments[_key5];
            }

            var _this4 = possibleConstructorReturn(this, (_ref = Transfromer.__proto__ || Object.getPrototypeOf(Transfromer)).call.apply(_ref, [this].concat(args)));

            _this4.fn = fn;
            return _this4;
        }

        createClass(Transfromer, [{
            key: 'doRender',
            value: function doRender(context) {
                var _this5 = this;

                return this.fn.apply(null, this.args.map(function (it, i) {
                    return _this5.arg(i, context);
                }));
            }
        }]);
        return Transfromer;
    }(Helper);

    var DelayTransfomer = function (_Transfromer) {
        inherits(DelayTransfomer, _Transfromer);

        function DelayTransfomer(name) {
            var _ref2;

            classCallCheck(this, DelayTransfomer);

            for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key6 = 1; _key6 < _len5; _key6++) {
                args[_key6 - 1] = arguments[_key6];
            }

            var _this6 = possibleConstructorReturn(this, (_ref2 = DelayTransfomer.__proto__ || Object.getPrototypeOf(DelayTransfomer)).call.apply(_ref2, [this, null].concat(args)));

            _this6.name = name;
            return _this6;
        }

        createClass(DelayTransfomer, [{
            key: 'init',
            value: function init(root) {
                var helpers = root._options.helpers;

                if (helpers && helpers[this.name]) this.fn = helpers[this.name];else throw new Error('no helper found: ' + name);
            }
        }]);
        return DelayTransfomer;
    }(Transfromer);

    var EchoHelper = function (_Helper2) {
        inherits(EchoHelper, _Helper2);

        function EchoHelper() {
            classCallCheck(this, EchoHelper);
            return possibleConstructorReturn(this, (EchoHelper.__proto__ || Object.getPrototypeOf(EchoHelper)).apply(this, arguments));
        }

        createClass(EchoHelper, [{
            key: 'doRender',
            value: function doRender(context) {
                return this.arg(0, context);
            }
        }]);
        return EchoHelper;
    }(Helper);

    var ConcatHelper = function (_Helper3) {
        inherits(ConcatHelper, _Helper3);

        function ConcatHelper() {
            classCallCheck(this, ConcatHelper);

            var _this8 = possibleConstructorReturn(this, (ConcatHelper.__proto__ || Object.getPrototypeOf(ConcatHelper)).apply(this, arguments));

            _this8.name = 'concat';
            return _this8;
        }

        createClass(ConcatHelper, [{
            key: 'check',
            value: function check() {
                this.currentKeys = this.dynamicKeys;
            }
        }, {
            key: 'doRender',
            value: function doRender(context) {
                var _this9 = this;

                return this.args.map(function (it, i) {
                    return _this9.arg(i, context);
                }).join(' ');
            }
        }]);
        return ConcatHelper;
    }(Helper);

    var IfHelper = function (_Helper4) {
        inherits(IfHelper, _Helper4);

        function IfHelper() {
            classCallCheck(this, IfHelper);

            var _this10 = possibleConstructorReturn(this, (IfHelper.__proto__ || Object.getPrototypeOf(IfHelper)).apply(this, arguments));

            _this10.name = 'if';
            return _this10;
        }

        createClass(IfHelper, [{
            key: 'check',
            value: function check() {
                this.assertCount(2, 3, 4, 5);
                this.assertDynamic(0);
            }
        }, {
            key: 'doRender',
            value: function doRender(context) {
                return this.arg(this.use(context), context);
            }
        }, {
            key: 'use',
            value: function use(context) {
                if (this.args.length <= 3) return this.useSingle(context);
                return this.useMultiple(context);
            }
        }, {
            key: 'useSingle',
            value: function useSingle(context) {
                return this.key(this.dynamicKeys[0], context) ? 1 : 2;
            }
        }, {
            key: 'useMultiple',
            value: function useMultiple(context) {
                var op = this.args[1][1];
                if (!Compare[op]) {
                    throw Error(op + ' is not a valid compare operator, use: eq(===), ne(!==), gt(>), lt(<), gte(>=), lte(<=)');
                }
                return Compare[op](this.arg(0, context), this.arg(2, context)) ? 3 : 4;
            }
        }]);
        return IfHelper;
    }(Helper);

    var UnlessHelper = function (_IfHelper) {
        inherits(UnlessHelper, _IfHelper);

        function UnlessHelper() {
            classCallCheck(this, UnlessHelper);

            var _this11 = possibleConstructorReturn(this, (UnlessHelper.__proto__ || Object.getPrototypeOf(UnlessHelper)).apply(this, arguments));

            _this11.name = 'unless';
            return _this11;
        }

        createClass(UnlessHelper, [{
            key: 'use',
            value: function use(context) {
                return this.key(this.dynamicKeys[0], context) ? 2 : 1;
            }
        }]);
        return UnlessHelper;
    }(IfHelper);

    var EachBlock = function (_AnchorNode) {
        inherits(EachBlock, _AnchorNode);

        function EachBlock(args, trueNode, falseNode) {
            classCallCheck(this, EachBlock);

            var _this = possibleConstructorReturn(this, (EachBlock.__proto__ || Object.getPrototypeOf(EachBlock)).call(this));

            _this.currentSize = 0;
            _this.nodes = [];
            _this.args = args;
            _this.trueNode = trueNode;
            _this.falseNode = falseNode;
            return _this;
        }

        createClass(EachBlock, [{
            key: 'init',
            value: function init(root, delay) {
                this.root = root;
            }
        }, {
            key: 'isEmpty',
            value: function isEmpty(list) {
                return !list || Array.isArray(list) && !list.length || (typeof list === 'undefined' ? 'undefined' : _typeof(list)) === 'object' && !Object.keys(list);
            }
        }, {
            key: 'sub',
            value: function sub(context, i) {
                var o = Object.assign({}, context);
                if (!o._each) o._each = [];
                var v = getValue(this.args[0], context);
                o._each.push({ list: v, index: i, key: this.args[2] });
                o[this.args[2]] = v[i];
                if (this.args[3]) o[this.args[3]] = i;
                return o;
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                get(EachBlock.prototype.__proto__ || Object.getPrototypeOf(EachBlock.prototype), 'render', this).call(this, context, delay);
                if (this.falseNode) this.falseNode.parent = this.newParent;
                var list = getValue(this.args[0], context);
                if (this.isEmpty(list)) {
                    this.renderElse(context, delay);
                    return;
                }
                var kv = Array.isArray(list) ? list.map(function (it, i) {
                    return [i, it];
                }) : Object.keys(list).map(function (it) {
                    return [it, list[it]];
                });
                this.renderKeyValue(kv, context, delay);
            }
        }, {
            key: 'createTrueNode',
            value: function createTrueNode(i, context, delay) {
                var n = this.trueNode();
                n.parent = this.newParent;
                this.nodes[i] = n;
                n.init(this.root, delay);
                delay.execute().then(function () {
                    return n.render(context, delay);
                });
            }
        }, {
            key: 'renderKeyValue',
            value: function renderKeyValue(arr, context, delay) {
                var _this2 = this;

                this.currentSize = arr.length;
                arr.forEach(function (it, i) {
                    var sub = _this2.sub(context, i);
                    _this2.createTrueNode(i, sub, delay);
                });
            }
        }, {
            key: 'renderElse',
            value: function renderElse(context, delay) {
                if (!this.falseNode) return;
                this.falseNode.init(this.root, delay);
                this.falseNode.render(context, delay);
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                if (!this.rendered) return;
                var list = getValue(this.args[0], context);
                var empty = this.isEmpty(list);
                if (empty && !this.currentSize) {
                    this.updateElse(context, delay);
                    return;
                }
                if (empty) {
                    this.currentSize = 0;
                    this.nodes.forEach(function (it) {
                        return it.destroy(delay);
                    });
                    this.nodes = [];
                    this.renderElse(context, delay);
                    return;
                }
                var kv = Array.isArray(list) ? list.map(function (it, i) {
                    return [i, it];
                }) : Object.keys(list).map(function (it) {
                    return [it, list[it]];
                });
                this.updateKeyValue(kv, context, delay);
            }
        }, {
            key: 'updateElse',
            value: function updateElse(context, delay) {
                if (this.falseNode) this.falseNode.update(context, delay);
            }
        }, {
            key: 'updateKeyValue',
            value: function updateKeyValue(arr, context, delay) {
                var _this3 = this;

                this.currentSize = arr.length;
                arr.forEach(function (it, i) {
                    var sub = _this3.sub(context, i);
                    if (_this3.nodes[i]) {
                        _this3.nodes[i].clearHelper();
                        _this3.nodes[i].update(sub, delay);
                    } else {
                        _this3.createTrueNode(i, sub, delay);
                    }
                });
                while (this.nodes.length !== this.currentSize) {
                    var node = this.nodes.pop();
                    node.destroy(delay);
                }
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (!this.rendered) return;
                get(EachBlock.prototype.__proto__ || Object.getPrototypeOf(EachBlock.prototype), 'destroy', this).call(this, delay);
                if (!this.currentSize) {
                    if (this.falseNode) this.falseNode.destroy(delay);
                    return;
                }
                this.currentSize = 0;
                this.nodes.forEach(function (it) {
                    return it.destroy(delay);
                });
                this.nodes = [];
                this.rendered = false;
            }
        }]);
        return EachBlock;
    }(AnchorNode);

    var Loader = function () {
        function Loader(app, path, args) {
            classCallCheck(this, Loader);

            this._app = app;
            this._path = path;
            this._args = args;
        }

        createClass(Loader, [{
            key: 'load',
            value: function load(file, mod) {
                return this._app.options.getResource(this._app.options.scriptRoot + '/' + this._path + '/' + file);
            }
        }]);
        return Loader;
    }();

    var ModuleTemplate = function (_Template) {
        inherits(ModuleTemplate, _Template);

        function ModuleTemplate(exportedModels) {
            classCallCheck(this, ModuleTemplate);

            var _this = possibleConstructorReturn(this, (ModuleTemplate.__proto__ || Object.getPrototypeOf(ModuleTemplate)).call(this));

            _this.exportedModels = [];
            var me = _this;
            _this.exportedModels = exportedModels;
            _this.life = {
                stage: 'template',
                init: function init() {
                    var _this2 = this;

                    return Delay.also(function (d) {
                        return me.init(_this2, d);
                    });
                },
                beforeRender: function beforeRender() {
                    var _this3 = this;

                    return Delay.also(function (d) {
                        return me.render(_this3._context(), d);
                    });
                },
                updated: function updated() {
                    var _this4 = this;

                    return Delay.also(function (d) {
                        return me.update(_this4._context(), d);
                    });
                },
                beforeDestroy: function beforeDestroy() {
                    return Delay.also(function (d) {
                        return me.destroy(d);
                    });
                }
            };
            return _this;
        }

        return ModuleTemplate;
    }(Template);

    var ViewTemplate = function (_Template) {
        inherits(ViewTemplate, _Template);

        function ViewTemplate() {
            classCallCheck(this, ViewTemplate);

            var _this = possibleConstructorReturn(this, (ViewTemplate.__proto__ || Object.getPrototypeOf(ViewTemplate)).call(this));

            var me = _this;
            _this.life = {
                stage: 'template',
                init: function init() {
                    var _this2 = this;

                    return Delay.also(function (d) {
                        return me.init(_this2, d);
                    });
                },
                beforeRender: function beforeRender() {
                    var _this3 = this;

                    return Delay.also(function (d) {
                        return me.render(_this3._context(), d);
                    });
                },
                updated: function updated() {
                    var _this4 = this;

                    return Delay.also(function (d) {
                        return me.update(_this4._context(), d);
                    });
                },
                beforeDestroy: function beforeDestroy() {
                    return Delay.also(function (d) {
                        return me.destroy(d);
                    });
                }
            };
            return _this;
        }

        return ViewTemplate;
    }(Template);

    var callIt = function callIt(ctx, cycles, method) {
        var reverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        return cycles.filter(function (it) {
            return it[method];
        })[reverse ? 'reduceRight' : 'reduce'](function (acc, it) {
            return acc.then(function () {
                return it[method].apply(ctx);
            });
        }, Promise.resolve());
    };

    var LifecycleContainer = function () {
        function LifecycleContainer(app, options) {
            var _this = this;

            classCallCheck(this, LifecycleContainer);

            this._cycles = [];
            this.app = app;
            var cs = options.cycles || [];
            cs.push(options);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            args.forEach(function (it) {
                return it && cs.push(it);
            });
            cs.forEach(function (it) {
                return !it.stage && (it.stage = 'default');
            });
            app.options.stages.forEach(function (s) {
                return cs.forEach(function (c) {
                    if (c.stage === s) _this._cycles.push(c);
                });
            });
        }

        createClass(LifecycleContainer, [{
            key: '_doInit',
            value: function _doInit() {
                return callIt(this, this._cycles, 'init');
            }
        }, {
            key: '_doBeforeRender',
            value: function _doBeforeRender() {
                return callIt(this, this._cycles, 'beforeRender');
            }
        }, {
            key: '_doRendered',
            value: function _doRendered() {
                return callIt(this, this._cycles, 'rendered');
            }
        }, {
            key: '_doBeforeUpdate',
            value: function _doBeforeUpdate() {
                return callIt(this, this._cycles, 'beforeUpdate');
            }
        }, {
            key: '_doUpdated',
            value: function _doUpdated() {
                return callIt(this, this._cycles, 'updated');
            }
        }, {
            key: '_doBeforeDestroy',
            value: function _doBeforeDestroy() {
                return callIt(this, this._cycles, 'beforeDestroy', true);
            }
        }, {
            key: '_doDestroyed',
            value: function _doDestroyed() {
                return callIt(this, this._cycles, 'destroyed', true);
            }
        }]);
        return LifecycleContainer;
    }();

    var ComponentState;
    (function (ComponentState) {
        ComponentState[ComponentState["CREATED"] = 0] = "CREATED";
        ComponentState[ComponentState["INITED"] = 1] = "INITED";
        ComponentState[ComponentState["RENDERED"] = 2] = "RENDERED";
    })(ComponentState || (ComponentState = {}));

    var Renderable = function (_LifecycleContainer) {
        inherits(Renderable, _LifecycleContainer);

        function Renderable(app, options) {
            var _ref;

            classCallCheck(this, Renderable);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            var _this = possibleConstructorReturn(this, (_ref = Renderable.__proto__ || Object.getPrototypeOf(Renderable)).call.apply(_ref, [this, app, options].concat(args)));

            _this.ids = {};
            _this._busy = Promise.resolve();
            _this._status = ComponentState.CREATED;
            _this._options = options;
            return _this;
        }

        createClass(Renderable, [{
            key: "_render",
            value: function _render(target) {
                var _this2 = this;

                if (this._status !== ComponentState.INITED) return Promise.resolve();
                this._target = target;
                this._busy = this._busy.then(function () {
                    return _this2._doBeforeRender();
                }).then(function () {
                    return _this2._doRendered();
                }).then(function () {
                    return _this2._status = ComponentState.RENDERED;
                });
                return this._busy;
            }
        }, {
            key: "destroy",
            value: function destroy() {
                var _this3 = this;

                if (this._status !== ComponentState.RENDERED) return Promise.resolve();
                this._busy = this._busy.then(function () {
                    return _this3._doBeforeDestroy();
                }).then(function () {
                    return _this3._doDestroyed();
                }).then(function () {
                    return _this3._status = ComponentState.INITED;
                });
                return this._busy;
            }
        }, {
            key: "_init",
            value: function _init() {
                var _this4 = this;

                return this._busy = this._busy.then(function () {
                    return _this4._doInit();
                }).then(function () {
                    return _this4._status = ComponentState.INITED;
                });
            }
        }, {
            key: "_event",
            value: function _event(name) {
                var events = this._options.events;

                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                if (events && events[name]) events[name].apply(this, args);
            }
        }, {
            key: "_context",
            value: function _context() {
                var c = this.get();
                if (this._options.computed) {
                    c._computed = this._options.computed;
                }
                return c;
            }
        }, {
            key: "_action",
            value: function _action(name) {
                var _this5 = this;

                var actions = this._options.actions;

                for (var _len3 = arguments.length, data = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    data[_key3 - 1] = arguments[_key3];
                }

                if (actions && actions[name]) {
                    var _actions$name;

                    (_actions$name = actions[name]).call.apply(_actions$name, [this, function (d) {
                        return _this5._dispatch(name, d);
                    }].concat(data));
                    return;
                }
                this._dispatch(name, data[0]);
            }
        }]);
        return Renderable;
    }(LifecycleContainer);

    var Model = function () {
        function Model(options) {
            classCallCheck(this, Model);

            var opt = typeof options === 'function' ? { data: options } : options;
            this._options = opt;
            this.set(opt.data());
        }

        createClass(Model, [{
            key: 'set',
            value: function set$$1(data) {
                var d = data;
                var _options = this._options,
                    parser = _options.parser,
                    root = _options.root;

                if (parser) d = parser(d);
                if (root && d) d = d[root];
                this._data = d;
            }
        }, {
            key: 'get',
            value: function get$$1() {
                // clone it or make it readonly in dev mode
                return this._data;
            }
        }]);
        return Model;
    }();

    var Store = function () {
        function Store(mod, options, updateKey) {
            var _this = this;

            classCallCheck(this, Store);

            this._models = {};
            this._names = [];
            this._options = options;
            this._module = mod;
            var models = options.models;

            if (models) {
                this._names = Object.keys(models);
                this._names.forEach(function (k) {
                    return _this._models[k] = new Model(models[k]);
                });
            }
            if (!options.actions) options.actions = {};
            options.actions[updateKey] = function (data) {
                _this.set(data);
            };
        }

        createClass(Store, [{
            key: 'fire',
            value: function fire(name, data) {
                this._module.fire(name, data);
            }
        }, {
            key: 'get',
            value: function get$$1(name) {
                var _this2 = this;

                if (name) return this._models[name].get();
                return this._names.reduce(function (acc, item) {
                    acc[item] = _this2._models[item].get();
                    return acc;
                }, {});
            }
        }, {
            key: 'set',
            value: function set$$1(data) {
                var _this3 = this;

                this._names.forEach(function (k) {
                    return k in data && _this3._models[k].set(data[k]);
                });
            }
        }, {
            key: 'dispatch',
            value: function dispatch(name, payload) {
                var actions = this._options.actions;

                if (!actions || !actions[name]) return Promise.reject();
                return Promise.resolve(actions[name].call(this, payload));
            }
        }, {
            key: 'models',
            get: function get$$1() {
                return this._models;
            }
        }]);
        return Store;
    }();

    var View = function (_Renderable) {
        inherits(View, _Renderable);

        function View(mod, options) {
            classCallCheck(this, View);

            var _this = possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this, mod.app, options, options.template && options.template.life));

            _this._groups = {};
            _this._state = {};
            _this._module = mod;
            return _this;
        }

        createClass(View, [{
            key: '_init',
            value: function _init() {
                if (this._options.state) this.set(this._options.state, true);
                return get(View.prototype.__proto__ || Object.getPrototypeOf(View.prototype), '_init', this).call(this);
            }
        }, {
            key: 'get',
            value: function get$$1(key) {
                if (!key) return this._state;
                if (this._options.computed && this._options.computed[key]) {
                    return this._options.computed[key](this._state);
                }
                return this._state[key];
            }
        }, {
            key: 'set',
            value: function set$$1(data) {
                var _this2 = this;

                var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                if (silent || this._status !== ComponentState.RENDERED) {
                    Object.assign(this._state, data);
                    return Promise.resolve();
                }
                this._busy = this._busy.then(function () {
                    return _this2._doBeforeUpdate();
                }).then(function () {
                    return Object.assign(_this2._state, data);
                }).then(function () {
                    return _this2._doUpdated();
                });
                return this._busy;
            }
        }, {
            key: '_dispatch',
            value: function _dispatch(name, data) {
                return this._module._dispatch(name, data);
            }
        }, {
            key: 'regions',
            get: function get$$1() {
                return this._module.regions;
            }
        }]);
        return View;
    }(Renderable);

    // /name

    var Token = function () {
        function Token(key, next) {
            classCallCheck(this, Token);

            this.v = 9;
            this.key = key;
            this.next = next;
        }

        createClass(Token, [{
            key: 'match',
            value: function match(keys) {
                var c = keys[0];
                if (!c) return false;
                return this.doMatch(c, keys.slice(1));
            }
        }, {
            key: 'value',
            value: function value() {
                var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                var vv = v + this.v;
                return this.next ? this.next.value(vv * 10) : vv;
            }
        }, {
            key: 'doMatch',
            value: function doMatch(key, keys) {
                if (key !== this.key) return false;
                if (this.next) return this.next.match(keys);
                return { remain: keys };
            }
        }]);
        return Token;
    }();
    // /:name


    var ArgToken = function (_Token) {
        inherits(ArgToken, _Token);

        function ArgToken() {
            classCallCheck(this, ArgToken);

            var _this = possibleConstructorReturn(this, (ArgToken.__proto__ || Object.getPrototypeOf(ArgToken)).apply(this, arguments));

            _this.v = 8;
            return _this;
        }

        createClass(ArgToken, [{
            key: 'doMatch',
            value: function doMatch(key, keys) {
                var oo = defineProperty({}, this.key, key);
                if (!this.next) return { remain: keys, args: oo };
                var o = this.next.match(keys);
                if (o === false) return false;
                o.args ? Object.assign(o.args, oo) : o.args = oo;
                return o;
            }
        }]);
        return ArgToken;
    }(Token);
    // /*name


    var AllToken = function (_Token2) {
        inherits(AllToken, _Token2);

        function AllToken() {
            classCallCheck(this, AllToken);

            var _this2 = possibleConstructorReturn(this, (AllToken.__proto__ || Object.getPrototypeOf(AllToken)).apply(this, arguments));

            _this2.v = 7;
            return _this2;
        }

        createClass(AllToken, [{
            key: 'match',
            value: function match(keys) {
                if (!keys.length) return false;
                return { args: defineProperty({}, this.key, keys), remain: [] };
            }
        }]);
        return AllToken;
    }(Token);

    var create = function create(path) {
        var ts = path.trim().split('/').filter(function (it) {
            return !!it;
        });
        return ts.reduceRight(function (acc, item) {
            if (item.charAt(0) === '*') return new AllToken(item.slice(1), acc);
            if (item.charAt(0) === ':') return new ArgToken(item.slice(1), acc);
            return new Token(item, acc);
        }, null);
    };

    var Router = function () {
        function Router(module, routes) {
            classCallCheck(this, Router);

            this._keys = [];
            this._defs = [];
            this._currentKey = -1;
            this._module = module;
            this.initRoutes(routes);
        }

        createClass(Router, [{
            key: 'route',
            value: function route(keys) {
                for (var i = 0; i < this._keys.length; i++) {
                    var re = this._keys[i].match(keys);
                    if (re) return this.doRoute(i, re);
                }
                return Promise.resolve(false);
            }
        }, {
            key: 'leave',
            value: function leave() {
                var _this3 = this;

                return Promise.resolve().then(function () {
                    if (_this3._next) return _this3._next.leave();
                }).then(function () {
                    var h = _this3._defs[_this3._currentKey];
                    if (h && h.leave) return h.leave();
                });
            }
        }, {
            key: 'enter',
            value: function enter(idx, args, keys) {
                var _this4 = this;

                this._currentKey = idx;
                return this._defs[idx].enter(args).then(function (it) {
                    _this4._next = it;
                    if (it && keys.length) return it.route(keys);
                });
            }
        }, {
            key: 'doRoute',
            value: function doRoute(idx, result) {
                var _this5 = this;

                var h = this._defs[idx];
                if (this._currentKey === -1) {
                    return this.enter(idx, result.args, result.remain);
                }
                if (idx === this._currentKey) {
                    return Promise.resolve().then(function () {
                        if (h.update) return h.update(result.args);
                    }).then(function () {
                        if (_this5._next) return _this5._next.route(result.remain);
                    });
                }
                return this.leave().then(function () {
                    return _this5.enter(idx, result.args, result.remain);
                });
            }
        }, {
            key: 'initRoutes',
            value: function initRoutes(routes) {
                var _this6 = this;

                Object.keys(routes).map(function (key) {
                    return { key: key, token: create(key) };
                }).sort(function (a, b) {
                    return b.token.value() - a.token.value();
                }).forEach(function (it) {
                    _this6._keys.push(it.token);
                    _this6._defs.push(_this6.createHandler(routes[it.key]));
                });
            }
        }, {
            key: 'createHandler',
            value: function createHandler(h) {
                if (typeof h === 'string') return this.createModuleHandler({ ref: h });
                if ('enter' in h) return h;
                if ('action' in h) return this.createActionHandler(h);
                if ('ref' in h) return this.createModuleHandler(h);
                throw new Error('unsupported router handler');
            }
        }, {
            key: 'createActionHandler',
            value: function createActionHandler(h) {
                var _this7 = this;

                return {
                    enter: function enter(args) {
                        return _this7._module.dispatch(h.action, args).then(function () {
                            return null;
                        });
                    },
                    update: function update(args) {
                        return _this7._module.dispatch(h.action, args);
                    }
                };
            }
        }, {
            key: 'createModuleHandler',
            value: function createModuleHandler(h) {
                var _this8 = this;

                var item = void 0;
                return {
                    enter: function enter(args) {
                        var o = h.model ? defineProperty({}, h.model, args) : args;
                        return _this8._module.regions[h.region || 'default'].show(h.ref, o).then(function (it) {
                            item = it;
                            if (it instanceof Module) return it._router;
                            return null;
                        });
                    },
                    update: function update(args) {
                        var o = h.model ? defineProperty({}, h.model, args) : args;
                        if (item && item instanceof Module) return item.set(o);
                        return Promise.resolve();
                    }
                };
            }
        }]);
        return Router;
    }();

    var UPDATE_ACTION = 'update' + +new Date();
    var clone = function clone(target) {
        if (Array.isArray(target)) {
            return target.map(function (it) {
                return clone(it);
            });
        }
        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
            return Object.keys(target).reduce(function (acc, it) {
                acc[it] = clone(target[it]);
                return acc;
            }, {});
        }
        return target;
    };
    var moduleReferences = {};

    var Module = function (_Renderable) {
        inherits(Module, _Renderable);

        function Module(app, loader, options) {
            var extraState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            classCallCheck(this, Module);

            var _this = possibleConstructorReturn(this, (Module.__proto__ || Object.getPrototypeOf(Module)).call(this, app, options, options.template && options.template.life));

            _this._items = {};
            _this._handlers = {};
            _this._loader = loader;
            _this._extraState = extraState;
            _this.regions = {};
            if (options.routes) _this._router = new Router(_this, options.routes);
            return _this;
        }

        createClass(Module, [{
            key: 'set',
            value: function set$$1(data) {
                if (!this._options.template) return;
                var exportedModels = this._options.template.exportedModels;

                if (!exportedModels || !exportedModels.length) return;
                var d = exportedModels.reduce(function (acc, item) {
                    if (data[item]) acc[item] = data[item];
                    return acc;
                }, {});
                return this._status === ComponentState.CREATED ? this._store.dispatch(UPDATE_ACTION, d) : this._dispatch(UPDATE_ACTION, d);
            }
        }, {
            key: 'get',
            value: function get$$1(name) {
                var obj = this._store.get(name);
                // TODO only works in dev mode
                return clone(obj);
            }
        }, {
            key: 'on',
            value: function on(name, handler) {
                if (!this._handlers[name]) this._handlers[name] = [];
                var hs = this._handlers[name];
                if (hs.indexOf(handler) !== -1) return { dispose: function dispose() {} };
                hs.push(handler);
                return {
                    dispose: function dispose() {
                        var idx = hs.indexOf(handler);
                        if (idx !== -1) hs.splice(idx, 1);
                    }
                };
            }
        }, {
            key: 'fire',
            value: function fire(name, data) {
                var _this2 = this;

                if (!this._handlers[name]) return;
                var hs = this._handlers[name].slice();
                hs.forEach(function (it) {
                    return it.call(_this2, data);
                });
            }
        }, {
            key: '_createItem',
            value: function _createItem(name, state) {
                var opt = this._items[name];
                var item = opt.type === 'view' ? new View(this, opt.options) : new Module(this.app, opt.loader, opt.options, state);
                return item._init().then(function () {
                    return item;
                });
            }
        }, {
            key: '_dispatch',
            value: function _dispatch(name, payload) {
                var _this3 = this;

                this._busy = this._busy.then(function () {
                    return _this3._doBeforeUpdate();
                }).then(function () {
                    return _this3._store.dispatch(name, payload);
                }).then(function () {
                    return _this3._doUpdated();
                });
                return this._busy;
            }
        }, {
            key: '_render',
            value: function _render(target) {
                var _this4 = this;

                var busy = get(Module.prototype.__proto__ || Object.getPrototypeOf(Module.prototype), '_render', this).call(this, target);
                if (busy === this._busy) {
                    this._busy = this._busy.then(function () {
                        var store = _this4._options.store;

                        if (store && store.actions && store.actions.init) {
                            return _this4._dispatch('init');
                        }
                    });
                    return this._busy;
                }
                return busy;
            }
        }, {
            key: '_init',
            value: function _init() {
                var _this5 = this;

                this._store = new Store(this, this._options.store || {}, UPDATE_ACTION);
                this.set(Object.assign({}, this._options.state, this._extraState));
                return this._loadItems().then(function () {
                    return get(Module.prototype.__proto__ || Object.getPrototypeOf(Module.prototype), '_init', _this5).call(_this5);
                });
            }
        }, {
            key: '_loadItems',
            value: function _loadItems() {
                var _this6 = this;

                var items = this._options.items;

                if (!items) return Promise.resolve();
                var ps = [];
                if (items.views) {
                    ps = ps.concat(items.views.map(function (it) {
                        return { name: it, type: 'view', loader: _this6._loader };
                    }));
                }
                if (items.refs) {
                    ps = ps.concat(items.refs.map(function (it) {
                        var obj = moduleReferences[it];
                        var loader = _this6.app.createLoader(obj.path, { name: obj.loader, args: obj.args });
                        return { name: it, type: 'module', loader: loader };
                    }));
                }
                if (items.modules) {
                    ps = ps.concat(Object.keys(items.modules).map(function (it) {
                        var path = items.modules[it];
                        var loader = _this6.app.createLoader(path);
                        return { name: it, type: 'module', loader: loader };
                    }));
                }
                return Promise.all(ps.map(function (k, i) {
                    return ps[i].loader.load(ps[i].type === 'view' ? ps[i].name : 'index', _this6);
                })).then(function (data) {
                    ps.forEach(function (p, i) {
                        _this6._items[p.name] = { type: p.type, loader: p.loader, options: data[i] };
                    });
                });
            }
        }]);
        return Module;
    }(Renderable);

    var Application = function () {
        function Application(options) {
            classCallCheck(this, Application);

            this.loaders = {};
            this.options = Object.assign({
                stages: ['init', 'template', 'default'],
                scriptRoot: 'app',
                entry: 'viewport'
            }, options);
            this.registerLoader(Loader);
        }

        createClass(Application, [{
            key: 'registerLoader',
            value: function registerLoader(loader) {
                var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

                this.loaders[name] = loader;
            }
        }, {
            key: 'createLoader',
            value: function createLoader(path, loader) {
                if (loader) {
                    return new this.loaders[loader.name](this, path, loader.args);
                }
                return new this.loaders.default(this, path);
            }
        }, {
            key: 'start',
            value: function start() {
                var _this = this;

                return this.startViewport().then(function (item) {
                    console.log(item);
                    _this.startRouter(item);
                });
            }
        }, {
            key: 'startViewport',
            value: function startViewport() {
                var _this2 = this;

                var loader = void 0;
                var _options = this.options,
                    entry = _options.entry,
                    container = _options.container;

                var create = function create(lo, options) {
                    var v = new Module(_this2, lo, options);
                    return v._init().then(function () {
                        return v._render(createAppendable(container));
                    }).then(function () {
                        return v;
                    });
                };
                if (typeof entry === 'string') {
                    loader = this.createLoader(entry);
                } else {
                    return create(this.createLoader(null), entry);
                }
                return loader.load('index', null).then(function (opt) {
                    return create(loader, opt);
                });
            }
        }, {
            key: 'startRouter',
            value: function startRouter(item) {
                if (!item._router) return;
                var doIt = function doIt() {
                    var hash = window.location.hash;
                    if (hash.slice(0, 2) !== '#/') return;
                    var hs = hash.slice(2).split('/').filter(function (it) {
                        return !!it;
                    });
                    if (!hs.length) return;
                    item._router.route(hs).then(function (it) {
                        console.log(it);
                    });
                };
                window.addEventListener('popstate', doIt);
                doIt();
            }
        }]);
        return Application;
    }();

    var ps = [['accept', 0, ['form', 'input']], ['accept-charset', 'acceptCharset', ['form']], ['accesskey', 'accessKey', 0], ['action', 0, ['form']], ['align', 0, ['applet', 'caption', 'col', 'colgroup', 'hr', 'iframe', 'img', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']], ['allowfullscreen', 'allowFullscreen', ['iframe']], ['alt', 0, ['applet', 'area', 'img', 'input']], ['async', 0, ['script']], ['autocomplete', 0, ['form', 'input']], ['autofocus', 0, ['button', 'input', 'keygen', 'select', 'textarea']], ['autoplay', 0, ['audio', 'video']], ['autosave', 0, ['input']], ['bgcolor', 'bgColor', ['body', 'col', 'colgroup', 'marquee', 'table', 'tbody', 'tfoot', 'td', 'th', 'tr']], ['border', 0, ['img', 'object', 'table']], ['buffered', 0, ['audio', 'video']], ['challenge', 0, ['keygen']], ['charset', 0, ['meta', 'script']], ['checked', 0, ['command', 'input']], ['cite', 0, ['blockquote', 'del', 'ins', 'q']], ['class', 'className', 0], ['code', 0, ['applet']], ['codebase', 'codeBase', ['applet']], ['color', 0, ['basefont', 'font', 'hr']], ['cols', 0, ['textarea']], ['colspan', 'colSpan', ['td', 'th']], ['content', 0, ['meta']], ['contenteditable', 'contentEditable', 0], ['contextmenu', 0, 0], ['controls', 0, ['audio', 'video']], ['coords', 0, ['area']], ['data', 0, ['object']], ['datetime', 'dateTime', ['del', 'ins', 'time']], ['default', 0, ['track']], ['defer', 0, ['script']], ['dir', 0, 0], ['dirname', 'dirName', ['input', 'textarea']], ['disabled', 0, ['button', 'command', 'fieldset', 'input', 'keygen', 'optgroup', 'option', 'select', 'textarea']], ['download', 0, ['a', 'area']], ['draggable', 0, 0], ['dropzone', 0, 0], ['enctype', 0, ['form']], ['for', 'htmlFor', ['label', 'output']], ['form', 0, ['button', 'fieldset', 'input', 'keygen', 'label', 'meter', 'object', 'output', 'progress', 'select', 'textarea']], ['formaction', 0, ['input', 'button']], ['headers', 0, ['td', 'th']], ['height', 0, ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']], ['hidden', 0, 0], ['high', 0, ['meter']], ['href', 0, ['a', 'area', 'base', 'link']], ['hreflang', 0, ['a', 'area', 'link']], ['http-equiv', 'httpEquiv', ['meta']], ['icon', 0, ['command']], ['id', 0, 0], ['indeterminate', 0, ['input']], ['ismap', 'isMap', ['img']], ['itemprop', 0, 0], ['keytype', 0, ['keygen']], ['kind', 0, ['track']], ['label', 0, ['track']], ['lang', 0, 0], ['language', 0, ['script']], ['loop', 0, ['audio', 'bgsound', 'marquee', 'video']], ['low', 0, ['meter']], ['manifest', 0, ['html']], ['max', 0, ['input', 'meter', 'progress']], ['maxlength', 'maxLength', ['input', 'textarea']], ['media', 0, ['a', 'area', 'link', 'source', 'style']], ['method', 0, ['form']], ['min', 0, ['input', 'meter']], ['multiple', 0, ['input', 'select']], ['muted', 0, ['audio', 'video']], ['name', 0, ['button', 'form', 'fieldset', 'iframe', 'input', 'keygen', 'object', 'output', 'select', 'textarea', 'map', 'meta', 'param']], ['novalidate', 'noValidate', ['form']], ['open', 0, ['details']], ['optimum', 0, ['meter']], ['pattern', 0, ['input']], ['ping', 0, ['a', 'area']], ['placeholder', 0, ['input', 'textarea']], ['poster', 0, ['video']], ['preload', 0, ['audio', 'video']], ['radiogroup', 0, ['command']], ['readonly', 'readOnly', ['input', 'textarea']], ['rel', 0, ['a', 'area', 'link']], ['required', 0, ['input', 'select', 'textarea']], ['reversed', 0, ['ol']], ['rows', 0, ['textarea']], ['rowspan', 'rowSpan', ['td', 'th']], ['sandbox', 0, ['iframe']], ['scope', 0, ['th']], ['scoped', 0, ['style']], ['seamless', 0, ['iframe']], ['selected', 0, ['option']], ['shape', 0, ['a', 'area']], ['size', 0, ['input', 'select']], ['sizes', 0, ['link', 'img', 'source']], ['span', 0, ['col', 'colgroup']], ['spellcheck', 0, 0], ['src', 0, ['audio', 'embed', 'iframe', 'img', 'input', 'script', 'source', 'track', 'video']], ['srcdoc', 0, ['iframe']], ['srclang', 0, ['track']], ['srcset', 0, ['img']], ['start', 0, ['ol']], ['step', 0, ['input']], ['summary', 0, ['table']], ['tabindex', 'tabIndex', 0], ['target', 0, ['a', 'area', 'base', 'form']], ['title', 0, 0], ['type', 0, ['button', 'command', 'embed', 'object', 'script', 'source', 'style', 'menu']], ['usemap', 'useMap', ['img', 'input', 'object']], ['value', 0, ['button', 'option', 'input', 'li', 'meter', 'progress', 'param', 'select', 'textarea']], ['volume', 0, ['audio', 'video']], ['width', 0, ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']], ['wrap', 0, ['textarea']]];
    var attributes = ps.reduce(function (acc, item) {
        acc[item[0]] = {
            name: item[1],
            tags: item[2] && item[2].reduce(function (ac, i) {
                ac[i] = true;
                return ac;
            }, {})
        };
        return acc;
    }, {});
    // TODO set style, data set
    function setAttribute(el, name, value) {
        var n = name.toLowerCase();
        var t = el.tagName.toLowerCase();
        if (attributes[n] && attributes[name].tags[t]) {
            el[attributes[n].name || n] = value;
        } else {
            el.setAttribute(name, value);
        }
    }

    var StaticNode = function (_Node) {
        inherits(StaticNode, _Node);

        function StaticNode(name) {
            var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var id = arguments[2];
            classCallCheck(this, StaticNode);

            var _this = possibleConstructorReturn(this, (StaticNode.__proto__ || Object.getPrototypeOf(StaticNode)).call(this, id));

            _this.name = name;
            _this.attributes = attributes;
            if (name === 'svg') _this.inSvg = true;
            return _this;
        }

        createClass(StaticNode, [{
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                this.parent.append(this.element);
                this.children.forEach(function (it) {
                    return it.render(context, delay);
                });
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                this.children.forEach(function (it) {
                    return it.update(context, delay);
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (!this.rendered) return;
                get(StaticNode.prototype.__proto__ || Object.getPrototypeOf(StaticNode.prototype), 'destroy', this).call(this, delay);
                this.parent.remove(this.element);
                this.rendered = false;
            }
        }, {
            key: 'create',
            value: function create() {
                var element = this.inSvg ? document.createElementNS('http://www.w3.org/2000/svg', this.name) : document.createElement(this.name);
                this.attributes.forEach(function (it) {
                    return setAttribute(element, it[0], it[1]);
                });
                return element;
            }
        }]);
        return StaticNode;
    }(Node);

    var distruct = function distruct(obj, key) {
        var ks = key.split('.');
        var name = ks.pop();
        var target = ks.reduce(function (acc, it) {
            return acc[it];
        }, obj);
        return { name: name, target: target };
    };
    var bindIt = function bindIt(context, view, to, element, event, get, set) {
        var current = void 0;
        var obj = { context: context };
        var cb = function cb() {
            var _distruct = distruct(obj.context, to),
                name = _distruct.name,
                target = _distruct.target;

            current = get(element);
            // bind each key
            if (name === to && context._each && context._each.some(function (it) {
                return it.key === name;
            })) {
                var each = context._each.find(function (it) {
                    return it.key === name;
                });
                each.list[each.index] = current;
            } else {
                target[name] = current;
            }
            view.set({});
        };
        element.addEventListener(event, cb, false);
        var r = {
            dispose: function dispose() {
                element.removeEventListener(event, cb, false);
            },
            update: function update(ctx) {
                obj.context = ctx;
                var v = getValue(to, ctx);
                if (v !== current) {
                    set(element, v);
                    current = v;
                }
            }
        };
        r.update(context);
        return r;
    };
    var getSelectValue = function getSelectValue(el) {
        var opt = el.options[el.selectedIndex || 0];
        return opt && opt.value;
    };
    var setSelectOption = function setSelectOption(el, value) {
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < el.options.length; i++) {
            var opt = el.options[i];
            if (opt.value === value + '') {
                opt.selected = true;
                return;
            }
        }
    };
    var bindGroup = function bindGroup(context, view, group, to, element) {
        var obj = { context: context };
        var current = void 0;
        var cb = function cb() {
            if (group.busy) return;

            var _distruct2 = distruct(obj.context, to),
                name = _distruct2.name,
                target = _distruct2.target;

            current = group.type === 'radio' ? element.value : group.items.filter(function (it) {
                return it.element.checked;
            }).map(function (it) {
                return it.element.value;
            });
            if (name === to && context._each && context._each.some(function (it) {
                return it.key === name;
            })) {
                var each = context._each.find(function (it) {
                    return it.key === name;
                });
                each.list[each.index] = current;
            } else {
                target[name] = current;
            }
            group.busy = true;
            view.set({});
            group.busy = false;
        };
        element.addEventListener('change', cb, false);
        var r = {
            dispose: function dispose() {
                element.removeEventListener('change', cb, false);
            },
            update: function update(ctx) {
                obj.context = ctx;
                if (group.busy) return;
                var v = getValue(to, ctx);
                var its = group.items.map(function (it) {
                    return it.element;
                });
                var changed = false;
                if (group.type === 'radio' && v !== current) changed = true;
                if (!changed && group.type === 'checkbox' && v.some(function (it, i) {
                    return current[i] !== it;
                })) changed = true;
                if (!changed) return;
                if (group.type === 'radio') {
                    its.forEach(function (it) {
                        return it.checked = it.value === v + '';
                    });
                    return;
                }
                its.forEach(function (it) {
                    return it.checked = v.some(function (vv) {
                        return vv + '' === it.value;
                    });
                });
            }
        };
        r.update(context);
        return r;
    };
    var bind = function bind(node, context, from, to) {
        var tag = node.name.toLowerCase();
        var element = node.element;
        var view = node.root;
        if ((tag === 'input' || tag === 'textarea') && from === 'value') {
            return bindIt(context, view, to, element, 'input', function (el) {
                return el.value;
            }, function (el, value) {
                return el.value = value;
            });
        }
        if (tag === 'input' && from === 'checked') {
            return bindIt(context, view, to, element, 'change', function (el) {
                return el.checked;
            }, function (el, value) {
                return el.checked = value;
            });
        }
        if (tag === 'select' && from === 'value') {
            return bindIt(context, view, to, element, 'change', getSelectValue, setSelectOption);
        }
        if (tag === 'input' && from === 'group') {
            var type = element.type;
            if (type !== 'checkbox' && type !== 'radio') return null;
            return bindGroup(context, view, view._groups[to], to, element);
        }
        return null;
    };

    var DynamicNode = function (_StaticNode) {
        inherits(DynamicNode, _StaticNode);

        function DynamicNode() {
            classCallCheck(this, DynamicNode);

            var _this = possibleConstructorReturn(this, (DynamicNode.__proto__ || Object.getPrototypeOf(DynamicNode)).apply(this, arguments));

            _this.dynamicAttributes = {};
            _this.components = {};
            _this.events = {};
            _this.actions = {};
            _this.bindings = [];
            return _this;
        }

        createClass(DynamicNode, [{
            key: 'attribute',
            value: function attribute(name, helpers) {
                this.dynamicAttributes[name] = helpers;
            }
        }, {
            key: 'on',
            value: function on(event, method) {
                var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

                this.events[event] = { method: method, args: args };
            }
        }, {
            key: 'action',
            value: function action(event, method) {
                var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

                this.actions[event] = { method: method, args: args };
            }
        }, {
            key: 'bind',
            value: function bind$$1(from, to) {
                this.bindings.push([from, to]);
            }
        }, {
            key: 'component',
            value: function component(name, helpers) {
                this.components[name] = helpers;
            }
        }, {
            key: 'init',
            value: function init(root, delay) {
                var _this2 = this;

                get(DynamicNode.prototype.__proto__ || Object.getPrototypeOf(DynamicNode.prototype), 'init', this).call(this, root, delay);
                if (!(this.root instanceof View)) return;
                var view = this.root;
                this.bindings.forEach(function (_ref) {
                    var _ref2 = slicedToArray(_ref, 2),
                        from = _ref2[0],
                        to = _ref2[1];

                    if (from !== 'group' || _this2.name.toLowerCase() !== 'input') return;
                    var attr = _this2.attributes.find(function (it) {
                        return it[0].toLowerCase() === 'type';
                    });
                    if (!attr) return;
                    var type = attr[1].toLowerCase();
                    if (type !== 'checkbox' && type !== 'radio') return;
                    var groups = view._groups;
                    if (!groups[to]) groups[to] = { type: type, items: [], busy: false };else if (groups[to].type !== type) {
                        throw Error('binding group can not mix up checkbox and radio');
                    }
                    groups[to].items.push(_this2); // TODO if this item is hidden by if, should it works?
                });
                Object.keys(this.dynamicAttributes).forEach(function (k) {
                    _this2.dynamicAttributes[k].forEach(function (it) {
                        if (it instanceof DelayTransfomer) it.init(view);
                    });
                });
                Object.keys(this.components).forEach(function (k) {
                    return _this2.components[k].forEach(function (it) {
                        if (it instanceof DelayTransfomer) it.init(view);
                    });
                });
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                var _this3 = this;

                if (this.rendered) return;
                get(DynamicNode.prototype.__proto__ || Object.getPrototypeOf(DynamicNode.prototype), 'render', this).call(this, context, delay);
                this.updateAttributes(context);
                this.context = context;
                this.eventHooks = Object.keys(this.events).map(function (it) {
                    return _this3.initEvent(it, _this3.events[it].method, _this3.events[it].args);
                });
                this.actionHooks = Object.keys(this.actions).map(function (it) {
                    return _this3.initAction(it, _this3.actions[it].method, _this3.actions[it].args);
                });
                this.bindingHooks = this.bindings.map(function (it) {
                    return bind(_this3, context, it[0], it[1]);
                }).filter(function (it) {
                    return !!it;
                });
                this.componentHooks = Object.keys(this.components).map(function (it) {
                    var comp = _this3.root._options.components || {};
                    var fn = comp[it] || components[it];
                    if (!fn) {
                        throw new Error('Component ' + it + ' is not found.');
                    }
                    var vs = _this3.renderHelper(context, _this3.components[it]);
                    var hook = fn.apply(undefined, [_this3.element].concat(toConsumableArray(vs[1])));
                    return [it, hook];
                });
            }
        }, {
            key: 'initEvent',
            value: function initEvent(name, method, args) {
                var me = this;
                var cb = function cb(event) {
                    var _me$root;

                    var as = resolveEventArgument(this, me.context, args, event);
                    (_me$root = me.root)._event.apply(_me$root, [method].concat(toConsumableArray(as)));
                };
                return this.bindEvent(name, cb);
            }
        }, {
            key: 'initAction',
            value: function initAction(name, action, args) {
                if (!(this.root instanceof View)) return;
                var me = this;
                var cb = function cb(event) {
                    var data = resolveEventArgument(this, me.context, args, event);
                    var root = me.root;
                    root._action.apply(root, [action].concat(toConsumableArray(data)));
                };
                return this.bindEvent(name, cb);
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent(name, cb) {
                var _this4 = this;

                var ce = this.root._options.customEvents;
                if (!ce || !ce[name]) ce = this.root.app.options.customEvents;
                if (!ce || !ce[name]) ce = customEvents;
                if (ce && ce[name]) {
                    return ce[name](this.element, cb);
                }
                this.element.addEventListener(name, cb, false);
                return {
                    dispose: function dispose() {
                        _this4.element.removeEventListener(name, cb, false);
                    }
                };
            }
        }, {
            key: 'updateAttributes',
            value: function updateAttributes(context) {
                var _this5 = this;

                Object.keys(this.dynamicAttributes).forEach(function (it) {
                    var vs = _this5.renderHelper(context, _this5.dynamicAttributes[it]);
                    if (vs[0] === ChangeType.CHANGED) {
                        var vvs = vs[1];
                        if (vvs.length === 1) {
                            setAttribute(_this5.element, it, vvs[0]);
                        } else {
                            var v = it === 'class' ? vvs.join(' ') : vvs.join('');
                            setAttribute(_this5.element, it, v);
                        }
                    }
                });
            }
        }, {
            key: 'renderHelper',
            value: function renderHelper(context, helpers) {
                var vs = helpers.map(function (it) {
                    return it.render(context);
                });
                if (vs.some(function (i) {
                    return i[0] === ChangeType.CHANGED;
                })) {
                    return [ChangeType.CHANGED, vs.map(function (it) {
                        return it[1];
                    })];
                }
                return [ChangeType.NOT_CHANGED, null];
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                var _this6 = this;

                if (!this.rendered) return;
                this.updateAttributes(context);
                this.context = context;
                this.bindingHooks.forEach(function (it) {
                    return it.update(context);
                });
                this.children.forEach(function (it) {
                    return it.update(context, delay);
                });
                this.componentHooks.forEach(function (_ref3) {
                    var _ref4 = slicedToArray(_ref3, 2),
                        name = _ref4[0],
                        hook = _ref4[1];

                    var vs = _this6.renderHelper(context, _this6.components[name]);
                    if (vs[0] === ChangeType.NOT_CHANGED) return;
                    hook.update.apply(hook, toConsumableArray(vs[1]));
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (!this.rendered) return;
                get(DynamicNode.prototype.__proto__ || Object.getPrototypeOf(DynamicNode.prototype), 'destroy', this).call(this, delay);
                this.bindingHooks.forEach(function (it) {
                    return it.dispose();
                });
                this.actionHooks.forEach(function (it) {
                    return it.dispose();
                });
                this.eventHooks.forEach(function (it) {
                    return it.dispose();
                });
                this.componentHooks.forEach(function (it) {
                    return it[1].dispose();
                });
                this.bindingHooks = [];
                this.actionHooks = [];
                this.eventHooks = [];
                this.componentHooks = [];
            }
        }, {
            key: 'clearHelper',
            value: function clearHelper() {
                var _this7 = this;

                Object.keys(this.dynamicAttributes).forEach(function (it) {
                    return _this7.dynamicAttributes[it].forEach(function (h) {
                        return h.clear();
                    });
                });
                get(DynamicNode.prototype.__proto__ || Object.getPrototypeOf(DynamicNode.prototype), 'clearHelper', this).call(this);
            }
        }]);
        return DynamicNode;
    }(StaticNode);

    var StaticTextNode = function (_Node) {
        inherits(StaticTextNode, _Node);

        function StaticTextNode() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            classCallCheck(this, StaticTextNode);

            var _this = possibleConstructorReturn(this, (StaticTextNode.__proto__ || Object.getPrototypeOf(StaticTextNode)).call(this));

            _this.data = data;
            _this.node = document.createTextNode(_this.data);
            return _this;
        }

        createClass(StaticTextNode, [{
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                this.parent.append(this.node);
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (!this.rendered) return;
                get(StaticTextNode.prototype.__proto__ || Object.getPrototypeOf(StaticTextNode.prototype), 'destroy', this).call(this, delay);
                this.parent.remove(this.node);
                this.rendered = false;
            }
        }]);
        return StaticTextNode;
    }(Node);

    var DynamicTextNode = function (_StaticTextNode) {
        inherits(DynamicTextNode, _StaticTextNode);

        function DynamicTextNode(helper) {
            classCallCheck(this, DynamicTextNode);

            var _this2 = possibleConstructorReturn(this, (DynamicTextNode.__proto__ || Object.getPrototypeOf(DynamicTextNode)).call(this));

            _this2.helper = helper;
            return _this2;
        }

        createClass(DynamicTextNode, [{
            key: 'init',
            value: function init(root) {
                if (root instanceof View && this.helper instanceof DelayTransfomer) {
                    this.helper.init(root);
                }
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                get(DynamicTextNode.prototype.__proto__ || Object.getPrototypeOf(DynamicTextNode.prototype), 'render', this).call(this, context, delay);
                this.update(context, delay);
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                var r = this.helper.render(context);
                if (r[0] === ChangeType.CHANGED) {
                    this.node.data = r[1];
                }
            }
        }, {
            key: 'clearHelper',
            value: function clearHelper() {
                this.helper.clear();
                get(DynamicTextNode.prototype.__proto__ || Object.getPrototypeOf(DynamicTextNode.prototype), 'clearHelper', this).call(this);
            }
        }]);
        return DynamicTextNode;
    }(StaticTextNode);

    var TextNode = function (_Node2) {
        inherits(TextNode, _Node2);

        function TextNode() {
            classCallCheck(this, TextNode);

            var _this3 = possibleConstructorReturn(this, (TextNode.__proto__ || Object.getPrototypeOf(TextNode)).call(this));

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _this3.nodes = args.map(function (it) {
                return typeof it === 'string' ? new StaticTextNode(it) : new DynamicTextNode(it);
            });
            return _this3;
        }

        createClass(TextNode, [{
            key: 'init',
            value: function init(root, delay) {
                var _this4 = this;

                this.nodes.forEach(function (it) {
                    it.parent = _this4.parent;
                    it.init(root, delay);
                });
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                this.nodes.forEach(function (it) {
                    return it.render(context, delay);
                });
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                this.nodes.forEach(function (it) {
                    return it.update(context, delay);
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                this.nodes.forEach(function (it) {
                    return it.destroy(delay);
                });
            }
        }, {
            key: 'clearHelper',
            value: function clearHelper() {
                this.nodes.forEach(function (it) {
                    return it.clearHelper();
                });
            }
        }]);
        return TextNode;
    }(Node);

    var ReferenceNode = function (_AnchorNode) {
        inherits(ReferenceNode, _AnchorNode);

        function ReferenceNode(name, id) {
            classCallCheck(this, ReferenceNode);

            var _this = possibleConstructorReturn(this, (ReferenceNode.__proto__ || Object.getPrototypeOf(ReferenceNode)).call(this, id));

            _this.events = {};
            _this.actions = {};
            _this.bindings = [];
            _this.grouped = {};
            _this.hooks = [];
            _this.name = name;
            return _this;
        }

        createClass(ReferenceNode, [{
            key: 'bind',
            value: function bind(from, to) {
                this.bindings.push([from, to || from]);
            }
        }, {
            key: 'on',
            value: function on(event, method, args) {
                this.events[event] = { method: method, args: args };
            }
        }, {
            key: 'action',
            value: function action(event, method, args) {
                this.actions[event] = { method: method, args: args };
            }
        }, {
            key: 'init',
            value: function init(root, delay) {
                var _this2 = this;

                this.root = root;
                var fn = function fn(i) {
                    _this2.item = i;
                    if (_this2.id) root.ids[_this2.id] = i;
                };
                if (root instanceof View) {
                    delay.add(root._module._createItem(this.name).then(fn));
                } else {
                    delay.add(root._createItem(this.name).then(fn));
                }
                this.children.forEach(function (it) {
                    var name = 'default';
                    if (it instanceof StaticNode) {
                        var attr = it.attributes.find(function (n) {
                            return n[0] === 'region';
                        });
                        if (attr) name = attr[1];
                    }
                    it.init(root, delay);
                    if (!_this2.grouped[name]) _this2.grouped[name] = [];
                    _this2.grouped[name].push(it);
                });
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                var _this3 = this;

                if (this.rendered) return;
                this.rendered = true;
                get(ReferenceNode.prototype.__proto__ || Object.getPrototypeOf(ReferenceNode.prototype), 'render', this).call(this, context, delay);
                delay.add(this.item.set(this.bindings.reduce(function (acc, item) {
                    acc[item[1]] = getValue(item[0], context);
                    return acc;
                }, {})));
                delay.add(this.item._render(this.newParent).then(function () {
                    return Promise.all(Object.keys(_this3.grouped).map(function (k) {
                        return _this3.item.regions[k]._showNode(_this3.grouped[k], context);
                    }));
                }));
                this.context = context;
                var cbs = [];
                if (this.item instanceof Module) {
                    var m = this.item;
                    cbs = cbs.concat(this.bindEvents(this.root, m, context));
                    cbs = cbs.concat(this.bindActions(this.root, m, context));
                    this.hooks = cbs.map(function (it) {
                        return m.on(it.event, it.fn);
                    });
                }
            }
        }, {
            key: 'bindEvents',
            value: function bindEvents(root, target, context) {
                var me = this;
                var obj = { context: context };
                return Object.keys(this.events).map(function (it) {
                    var cb = function cb(event) {
                        var data = resolveEventArgument(this, obj.context, me.events[it].args, event);
                        root._event.apply(root, [me.events[it].method].concat(toConsumableArray(data)));
                    };
                    return { fn: cb, event: it, update: function update(ctx) {
                            return obj.context = ctx;
                        } };
                });
            }
        }, {
            key: 'bindActions',
            value: function bindActions(root, target, context) {
                var me = this;
                return Object.keys(this.actions).map(function (it) {
                    var cb = function cb(event) {
                        var data = resolveEventArgument(this, me.context, me.actions[it].args, event);
                        root._action.apply(root, [me.actions[it].method].concat(toConsumableArray(data)));
                    };
                    return { fn: cb, event: it };
                });
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                delay.add(this.item.set(this.bindings.reduce(function (acc, item) {
                    acc[item[1]] = getValue(item[0], context);
                    return acc;
                }, {})));
                this.context = context;
                this.children.forEach(function (it) {
                    return it.update(context, delay);
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                var _this4 = this;

                if (!this.rendered) return;
                get(ReferenceNode.prototype.__proto__ || Object.getPrototypeOf(ReferenceNode.prototype), 'destroy', this).call(this, delay);
                delay.add(this.item.destroy());
                this.hooks.forEach(function (it) {
                    return it.dispose();
                });
                this.hooks = [];
                delay.add(Promise.all(Object.keys(this.grouped).map(function (it) {
                    return _this4.item.regions[it].close();
                })));
                this.rendered = false;
            }
        }]);
        return ReferenceNode;
    }(AnchorNode);

    var RegionNode = function (_Node) {
        inherits(RegionNode, _Node);

        function RegionNode() {
            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
            classCallCheck(this, RegionNode);

            var _this = possibleConstructorReturn(this, (RegionNode.__proto__ || Object.getPrototypeOf(RegionNode)).call(this));

            _this.id = id;
            return _this;
        }

        createClass(RegionNode, [{
            key: 'init',
            value: function init(root, delay) {
                var _this2 = this;

                this.root = root;
                this.mod = root instanceof Module ? root : root._module;
                this.children.forEach(function (it) {
                    it.parent = _this2.parent;
                    it.init(root, delay);
                });
                var me = this;
                this.mod.regions[this.id] = {
                    show: function show(name, state) {
                        return me.show(name, state);
                    },
                    _showNode: function _showNode(nodes, context) {
                        return me.showNode(nodes, context);
                    },
                    close: function close() {
                        return me.close();
                    }
                };
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                this.context = context;
                this.children.forEach(function (it) {
                    return it.render(context, delay);
                });
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                if (!this.rendered) return;
                this.context = context;
                this.children.forEach(function (it) {
                    return it.update(context, delay);
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(delay) {
                if (!this.rendered) return;
                if (this.nodes) this.nodes.forEach(function (it) {
                    return it.destroy(delay);
                });
                if (this.item) delay.add(this.item.destroy());
                this.children.forEach(function (it) {
                    return it.destroy(delay);
                });
                this.rendered = false;
            }
        }, {
            key: 'showNode',
            value: function showNode(nodes, context) {
                var _this3 = this;

                if (!this.rendered) return;
                return this.close().then(function () {
                    _this3.nodes = nodes;
                    return Delay.also(function (d) {
                        return _this3.nodes.forEach(function (it) {
                            it.parent = _this3.parent;
                            it.render(context, d);
                        });
                    });
                });
            }
        }, {
            key: 'show',
            value: function show(name, state) {
                var _this4 = this;

                if (!this.rendered) return;
                return this.close().then(function () {
                    return _this4.mod._createItem(name, state);
                }).then(function (item) {
                    _this4.item = item;
                    return item._render(_this4.parent).then(function () {
                        return item;
                    });
                });
            }
        }, {
            key: 'close',
            value: function close() {
                var _this5 = this;

                if (!this.nodes && !this.item) return Promise.resolve();
                return Promise.resolve().then(function () {
                    if (_this5.nodes) return Delay.also(function (d) {
                        return _this5.nodes.forEach(function (it) {
                            return it.destroy(d);
                        });
                    });
                }).then(function () {
                    if (_this5.item) return _this5.item.destroy();
                }).then(function () {
                    _this5.nodes = null;
                    _this5.item = null;
                    return Delay.also(function (d) {
                        return _this5.children.forEach(function (it) {
                            return it.render(_this5.context, d);
                        });
                    });
                });
            }
        }]);
        return RegionNode;
    }(Node);

    var helpers = {
        echo: EchoHelper, if: IfHelper, unless: UnlessHelper, concat: ConcatHelper
    };
    var blocks = {
        if: IfBlock, unless: UnlessBlock, each: EachBlock
    };
    var loaders = {
        default: Loader
    };
    var SN = function SN(name, id) {
        for (var _len = arguments.length, attributes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            attributes[_key - 2] = arguments[_key];
        }

        return new StaticNode(name, attributes || [], id);
    };
    var DN = function DN(name, id) {
        for (var _len2 = arguments.length, attributes = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            attributes[_key2 - 2] = arguments[_key2];
        }

        return new DynamicNode(name, attributes || [], id);
    };
    var DA = function DA(d, name) {
        for (var _len3 = arguments.length, hs = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            hs[_key3 - 2] = arguments[_key3];
        }

        d.attribute(name, hs);
    };
    var BD = function BD(d, from, to) {
        d.bind(from, to);
    };
    var EV = function EV(d, event, method) {
        for (var _len4 = arguments.length, attrs = Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
            attrs[_key4 - 3] = arguments[_key4];
        }

        d.on(event, method, attrs);
    };
    var AC = function AC(d, event, method) {
        for (var _len5 = arguments.length, attrs = Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
            attrs[_key5 - 3] = arguments[_key5];
        }

        d.action(event, method, attrs);
    };
    var CO = function CO(d, name) {
        for (var _len6 = arguments.length, hs = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
            hs[_key6 - 2] = arguments[_key6];
        }

        d.component(name, hs);
    };
    var TX = function TX() {
        for (var _len7 = arguments.length, ss = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            ss[_key7] = arguments[_key7];
        }

        return new (Function.prototype.bind.apply(TextNode, [null].concat(ss)))();
    };
    var RG = function RG() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
        return new RegionNode(id);
    };
    var REF = function REF(name, id) {
        return new ReferenceNode(name, id);
    };
    var NDA = function NDA(v) {
        return [null, [1, v]];
    };
    var NSA = function NSA(v) {
        return [null, [0, v]];
    };
    var SV = function SV(v) {
        return [0, v];
    };
    var DV = function DV(v) {
        return [1, v];
    };
    var AT = function AT(n, v) {
        return [n, v];
    };
    var KV = function KV(k, v) {
        return [k, v || k];
    };
    var H = function H(n) {
        return Array.isArray(n) ? new EchoHelper(n) : new EchoHelper(DV(n));
    };
    var HH = function HH(n) {
        for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
            args[_key8 - 1] = arguments[_key8];
        }

        if (helpers[n]) return new (Function.prototype.bind.apply(helpers[n], [null].concat(args)))();
        return new (Function.prototype.bind.apply(DelayTransfomer, [null].concat([n], args)))();
    };
    var HIF = function HIF() {
        for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
        }

        return HH.apply(undefined, ['if'].concat(args));
    };
    var HUN = function HUN() {
        for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
        }

        return HH.apply(undefined, ['unless'].concat(args));
    };
    var EACH = function EACH(args, trueNode, falseNode) {
        return new EachBlock(args, trueNode, falseNode);
    };
    var IF = function IF(n, trueNode, falseNode) {
        return new IfBlock([DV(n)], trueNode, falseNode);
    };
    var IFC = function IFC(args, trueNode, falseNode) {
        return new IfBlock(args, trueNode, falseNode);
    };
    var UN = function UN(n, trueNode, falseNode) {
        return new UnlessBlock([DV(n)], trueNode, falseNode);
    };
    var C = function C(parent) {
        for (var _len11 = arguments.length, children = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
            children[_key11 - 1] = arguments[_key11];
        }

        return parent.setChildren(children);
    };
    var drizzle = {
        helpers: helpers, blocks: blocks, loaders: loaders, customEvents: customEvents, components: components,
        lifecycles: { module: [], view: [] },
        ModuleTemplate: ModuleTemplate, ViewTemplate: ViewTemplate, Application: Application, Loader: Loader,
        factory: {
            SN: SN, DN: DN, TX: TX, RG: RG, REF: REF, NDA: NDA, NSA: NSA, SV: SV, DV: DV, AT: AT, KV: KV, H: H, HH: HH, HIF: HIF, HUN: HUN,
            EACH: EACH, IF: IF, IFC: IFC, UN: UN, C: C, DA: DA, BD: BD, EV: EV, AC: AC, CO: CO
        }
    };

    return drizzle;

})));
//# sourceMappingURL=drizzle.js.map
