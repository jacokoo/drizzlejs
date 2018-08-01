(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.drizzle = factory());
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

    var Node = function () {
        function Node(id) {
            classCallCheck(this, Node);

            this.children = [];
            this.rendered = false;
            this.id = id;
        }

        createClass(Node, [{
            key: 'init',
            value: function init(root, delay) {
                this.root = root;
                this.element = this.create();
                if (this.id) root.ids[this.id] = this.element;
                this.children.forEach(function (it) {
                    return it.init(root, delay);
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
                var _this = this;

                this.children = children;
                children.forEach(function (it, i) {
                    it.nextSibling = children[i + 1];
                    it.parent = _this;
                });
            }
        }]);
        return Node;
    }();

    var FakeNode = function (_Node) {
        inherits(FakeNode, _Node);

        function FakeNode(el) {
            classCallCheck(this, FakeNode);

            var _this2 = possibleConstructorReturn(this, (FakeNode.__proto__ || Object.getPrototypeOf(FakeNode)).call(this));

            _this2.element = el;
            return _this2;
        }

        createClass(FakeNode, [{
            key: 'init',
            value: function init() {}
        }, {
            key: 'create',
            value: function create() {
                return this.element;
            }
        }]);
        return FakeNode;
    }(Node);

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

    var Delay = function () {
        function Delay() {
            classCallCheck(this, Delay);

            this.delays = [];
        }

        createClass(Delay, [{
            key: "add",
            value: function add(p) {
                this.delays.push(p);
            }
        }, {
            key: "execute",
            value: function execute() {
                return Promise.all(this.delays);
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
        return key.split('.').reduce(function (acc, item) {
            if (acc == null) return null;
            return acc[item];
        }, context);
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

    var Template = function () {
        function Template() {
            classCallCheck(this, Template);
        }

        createClass(Template, [{
            key: "init",
            value: function init(root, delay) {
                this.root = root;
                this.nodes.forEach(function (it) {
                    return it.init(root, delay);
                });
            }
        }, {
            key: "render",
            value: function render(context, delay) {
                var container = new FakeNode(this.root._element);
                var next = this.root._nextSibling && new FakeNode(this.root._nextSibling);
                this.nodes.forEach(function (it) {
                    it.parent = container;
                    it.nextSibling = next;
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
                    it.nextSibling = null;
                    it.parent = null;
                });
            }
        }]);
        return Template;
    }();

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
            key: 'render',
            value: function render(context) {
                var _this = this;

                if (!this.currentValues) return [ChangeType.CHANGED, this.renderIt(context)];
                var vs = this.currentKeys.map(function (it) {
                    return getValue(it, context);
                });
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
                this.assertCount(2, 3);
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
                return this.key(this.dynamicKeys[0], context) ? 1 : 2;
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

    var EqHelper = function (_Helper5) {
        inherits(EqHelper, _Helper5);

        function EqHelper() {
            classCallCheck(this, EqHelper);
            return possibleConstructorReturn(this, (EqHelper.__proto__ || Object.getPrototypeOf(EqHelper)).apply(this, arguments));
        }

        createClass(EqHelper, [{
            key: 'check',
            value: function check() {
                this.assertCount(3, 4);
            }
        }, {
            key: 'doRender',
            value: function doRender(context) {
                return this.arg(this.use(this.arg(0, context), this.arg(1, context)) ? 2 : 3, context);
            }
        }, {
            key: 'use',
            value: function use(v1, v2) {
                return v1 === v2;
            }
        }]);
        return EqHelper;
    }(Helper);

    var NeHelper = function (_EqHelper) {
        inherits(NeHelper, _EqHelper);

        function NeHelper() {
            classCallCheck(this, NeHelper);
            return possibleConstructorReturn(this, (NeHelper.__proto__ || Object.getPrototypeOf(NeHelper)).apply(this, arguments));
        }

        createClass(NeHelper, [{
            key: 'use',
            value: function use(v1, v2) {
                return v1 !== v2;
            }
        }]);
        return NeHelper;
    }(EqHelper);

    var GtHelper = function (_EqHelper2) {
        inherits(GtHelper, _EqHelper2);

        function GtHelper() {
            classCallCheck(this, GtHelper);
            return possibleConstructorReturn(this, (GtHelper.__proto__ || Object.getPrototypeOf(GtHelper)).apply(this, arguments));
        }

        createClass(GtHelper, [{
            key: 'use',
            value: function use(v1, v2) {
                return v1 > v2;
            }
        }]);
        return GtHelper;
    }(EqHelper);

    var GteHelper = function (_EqHelper3) {
        inherits(GteHelper, _EqHelper3);

        function GteHelper() {
            classCallCheck(this, GteHelper);
            return possibleConstructorReturn(this, (GteHelper.__proto__ || Object.getPrototypeOf(GteHelper)).apply(this, arguments));
        }

        createClass(GteHelper, [{
            key: 'use',
            value: function use(v1, v2) {
                return v1 >= v2;
            }
        }]);
        return GteHelper;
    }(EqHelper);

    var LtHelper = function (_EqHelper4) {
        inherits(LtHelper, _EqHelper4);

        function LtHelper() {
            classCallCheck(this, LtHelper);
            return possibleConstructorReturn(this, (LtHelper.__proto__ || Object.getPrototypeOf(LtHelper)).apply(this, arguments));
        }

        createClass(LtHelper, [{
            key: 'use',
            value: function use(v1, v2) {
                return v1 < v2;
            }
        }]);
        return LtHelper;
    }(EqHelper);

    var LteHelper = function (_EqHelper5) {
        inherits(LteHelper, _EqHelper5);

        function LteHelper() {
            classCallCheck(this, LteHelper);
            return possibleConstructorReturn(this, (LteHelper.__proto__ || Object.getPrototypeOf(LteHelper)).apply(this, arguments));
        }

        createClass(LteHelper, [{
            key: 'use',
            value: function use(v1, v2) {
                return v1 <= v2;
            }
        }]);
        return LteHelper;
    }(EqHelper);

    var IfBlock = function (_Node) {
        inherits(IfBlock, _Node);

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
                this.trueNode.parent = this.parent;
                this.trueNode.nextSibling = this.nextSibling;
                if (this.falseNode) {
                    this.falseNode.parent = this.parent;
                    this.falseNode.nextSibling = this.nextSibling;
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
                this.rendered = false;
            }
        }, {
            key: 'create',
            value: function create() {
                return null;
            }
        }]);
        return IfBlock;
    }(Node);

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

    var EqBlock = function (_IfBlock2) {
        inherits(EqBlock, _IfBlock2);

        function EqBlock() {
            classCallCheck(this, EqBlock);
            return possibleConstructorReturn(this, (EqBlock.__proto__ || Object.getPrototypeOf(EqBlock)).apply(this, arguments));
        }

        createClass(EqBlock, [{
            key: 'use',
            value: function use(context) {
                return this.use2(getAttributeValue(this.args[0], context), getAttributeValue(this.args[1], context));
            }
        }, {
            key: 'use2',
            value: function use2(v1, v2) {
                return v1 === v2;
            }
        }]);
        return EqBlock;
    }(IfBlock);

    var NeBlock = function (_EqBlock) {
        inherits(NeBlock, _EqBlock);

        function NeBlock() {
            classCallCheck(this, NeBlock);
            return possibleConstructorReturn(this, (NeBlock.__proto__ || Object.getPrototypeOf(NeBlock)).apply(this, arguments));
        }

        createClass(NeBlock, [{
            key: 'use2',
            value: function use2(v1, v2) {
                return v1 !== v2;
            }
        }]);
        return NeBlock;
    }(EqBlock);

    var GtBlock = function (_EqBlock2) {
        inherits(GtBlock, _EqBlock2);

        function GtBlock() {
            classCallCheck(this, GtBlock);
            return possibleConstructorReturn(this, (GtBlock.__proto__ || Object.getPrototypeOf(GtBlock)).apply(this, arguments));
        }

        createClass(GtBlock, [{
            key: 'use2',
            value: function use2(v1, v2) {
                return v1 > v2;
            }
        }]);
        return GtBlock;
    }(EqBlock);

    var GteBlock = function (_EqBlock3) {
        inherits(GteBlock, _EqBlock3);

        function GteBlock() {
            classCallCheck(this, GteBlock);
            return possibleConstructorReturn(this, (GteBlock.__proto__ || Object.getPrototypeOf(GteBlock)).apply(this, arguments));
        }

        createClass(GteBlock, [{
            key: 'use2',
            value: function use2(v1, v2) {
                return v1 >= v2;
            }
        }]);
        return GteBlock;
    }(EqBlock);

    var LtBlock = function (_EqBlock4) {
        inherits(LtBlock, _EqBlock4);

        function LtBlock() {
            classCallCheck(this, LtBlock);
            return possibleConstructorReturn(this, (LtBlock.__proto__ || Object.getPrototypeOf(LtBlock)).apply(this, arguments));
        }

        createClass(LtBlock, [{
            key: 'use2',
            value: function use2(v1, v2) {
                return v1 < v2;
            }
        }]);
        return LtBlock;
    }(EqBlock);

    var LteBlock = function (_EqBlock5) {
        inherits(LteBlock, _EqBlock5);

        function LteBlock() {
            classCallCheck(this, LteBlock);
            return possibleConstructorReturn(this, (LteBlock.__proto__ || Object.getPrototypeOf(LteBlock)).apply(this, arguments));
        }

        createClass(LteBlock, [{
            key: 'use2',
            value: function use2(v1, v2) {
                return v1 <= v2;
            }
        }]);
        return LteBlock;
    }(EqBlock);

    var EachBlock = function (_Node) {
        inherits(EachBlock, _Node);

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
                if (this.falseNode) this.falseNode.nextSibling = this.nextSibling;
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
                o._each.push({ list: context[this.args[0]], index: i, key: this.args[2] });
                o[this.args[2]] = context[this.args[0]][i];
                if (this.args[3]) o[this.args[3]] = i;
                return o;
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
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
            key: 'renderKeyValue',
            value: function renderKeyValue(arr, context, delay) {
                var _this2 = this;

                this.currentSize = arr.length;
                arr.forEach(function (it, i) {
                    var sub = _this2.sub(context, i);
                    _this2.nodes[i] = _this2.trueNode();
                    _this2.nodes[i].parent = _this2.parent;
                    _this2.nodes[i].nextSibling = _this2.nextSibling;
                    _this2.nodes[i].init(_this2.root, delay);
                    _this2.nodes[i].render(sub, delay);
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
                    if (_this3.nodes[i]) _this3.nodes[i].update(sub, delay);else {
                        _this3.nodes[i] = _this3.trueNode();
                        _this3.nodes[i].parent = _this3.parent;
                        _this3.nodes[i].nextSibling = _this3.nextSibling;
                        _this3.nodes[i].init(_this3.root, delay);
                        _this3.nodes[i].render(sub, delay);
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
        }, {
            key: 'create',
            value: function create() {
                return null;
            }
        }]);
        return EachBlock;
    }(Node);

    var Loader = function () {
        function Loader(app, path, args) {
            classCallCheck(this, Loader);

            this._app = app;
            this._path = path;
            this._args = args;
        }

        createClass(Loader, [{
            key: 'load',
            value: function load(file) {
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

            _this.options = { exportedModels: exportedModels, items: {} };
            var me = _this;
            _this.life = {
                stage: 'template',
                init: function init() {
                    var _this2 = this;

                    Delay.also(function (d) {
                        return me.init(_this2, d);
                    });
                },
                beforeRender: function beforeRender() {
                    var _this3 = this;

                    Delay.also(function (d) {
                        return me.render(_this3.get(), d);
                    });
                },
                updated: function updated() {
                    var _this4 = this;

                    Delay.also(function (d) {
                        return me.update(_this4.get(), d);
                    });
                },
                beforeDestroy: function beforeDestroy() {
                    Delay.also(function (d) {
                        return me.destroy(d);
                    });
                }
            };
            return _this;
        }

        createClass(ModuleTemplate, [{
            key: 'views',
            value: function views() {
                var _this5 = this;

                for (var _len = arguments.length, _views = Array(_len), _key = 0; _key < _len; _key++) {
                    _views[_key] = arguments[_key];
                }

                _views.forEach(function (it) {
                    return _this5.options.items[it] = { view: it };
                });
            }
        }, {
            key: 'modules',
            value: function modules(name, path, loader, args) {
                this.options.items[name] = loader ? { path: path, loader: { name: loader, args: args } } : { path: path };
            }
        }]);
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

                    Delay.also(function (d) {
                        return me.init(_this2, d);
                    });
                },
                beforeRender: function beforeRender() {
                    var _this3 = this;

                    Delay.also(function (d) {
                        return me.render(_this3._state, d);
                    });
                },
                updated: function updated() {
                    var _this4 = this;

                    Delay.also(function (d) {
                        return me.update(_this4._state, d);
                    });
                },
                beforeDestroy: function beforeDestroy() {
                    Delay.also(function (d) {
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
            value: function _render(el, nextSibling) {
                var _this2 = this;

                if (this._status !== ComponentState.INITED) return Promise.resolve();
                this._status = ComponentState.RENDERED;
                this._element = el;
                this._nextSibling = nextSibling;
                this._busy = this._busy.then(function () {
                    return _this2._doBeforeRender();
                }).then(function () {
                    return _this2._doRendered();
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
        }]);
        return Renderable;
    }(LifecycleContainer);

    var Model = function () {
        function Model(options) {
            classCallCheck(this, Model);

            this._options = options;
            this.set(options.data());
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
        function Store(options, updateKey) {
            var _this = this;

            classCallCheck(this, Store);

            this._models = {};
            this._names = [];
            this._options = options;
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
                    return data[k] && _this3._models[k].set(data[k]);
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
            key: 'set',
            value: function set$$1(data) {
                var _this2 = this;

                var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                if (silent) {
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
            key: '_action',
            value: function _action(name) {
                var _this3 = this;

                var actions = this._options.actions;

                for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    data[_key - 1] = arguments[_key];
                }

                if (actions && actions[name]) {
                    var _actions$name;

                    (_actions$name = actions[name]).call.apply(_actions$name, [this, function (d) {
                        return _this3._module.dispatch(name, d);
                    }].concat(data));
                    return;
                }
                this._module.dispatch(name, data[0]);
            }
        }]);
        return View;
    }(Renderable);

    var UPDATE_ACTION = 'update' + +new Date();

    var Module = function (_Renderable) {
        inherits(Module, _Renderable);

        function Module(app, loader, options) {
            classCallCheck(this, Module);

            var _this = possibleConstructorReturn(this, (Module.__proto__ || Object.getPrototypeOf(Module)).call(this, app, options, options.template && options.template.life));

            _this.items = {};
            _this._handlers = {};
            _this._loader = loader;
            return _this;
        }

        createClass(Module, [{
            key: 'set',
            value: function set$$1(data) {
                var exportedModels = this._options.exportedModels;

                if (!exportedModels || !exportedModels.length) return;
                var d = exportedModels.reduce(function (acc, item) {
                    if (data[item]) acc[item] = data[item];
                    return acc;
                }, {});
                return (this._status === ComponentState.CREATED ? this._store : this).dispatch(UPDATE_ACTION, d);
            }
        }, {
            key: 'get',
            value: function get$$1(name) {
                return this._store.get(name);
            }
        }, {
            key: 'dispatch',
            value: function dispatch(name, payload) {
                var _this2 = this;

                this._busy = this._busy.then(function () {
                    return _this2._doBeforeUpdate();
                }).then(function () {
                    return _this2._store.dispatch(name, payload);
                }).then(function () {
                    return _this2._doUpdated();
                });
                return this._busy;
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
                var _this3 = this;

                if (!this._handlers[name]) return;
                var hs = this._handlers[name].slice();
                hs.forEach(function (it) {
                    return it.call(_this3, data);
                });
            }
        }, {
            key: 'createItem',
            value: function createItem(name) {
                var opt = this.items[name];
                var item = opt.type === 'view' ? new View(this, opt.options) : new Module(this.app, opt.loader, opt.options);
                return item._init().then(function () {
                    return item;
                });
            }
        }, {
            key: '_render',
            value: function _render(el, nextSibling) {
                var _this4 = this;

                var busy = get(Module.prototype.__proto__ || Object.getPrototypeOf(Module.prototype), '_render', this).call(this, el, nextSibling);
                if (busy === this._busy) {
                    this._busy = this._busy.then(function () {
                        var store = _this4._options.store;

                        if (store && store.actions && store.actions.init) {
                            return _this4.dispatch('init');
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

                this._store = new Store(this._options.store || {}, UPDATE_ACTION);
                this.set(this._options.state || {});
                return this._loadItems().then(function () {
                    return get(Module.prototype.__proto__ || Object.getPrototypeOf(Module.prototype), '_init', _this5).call(_this5);
                });
            }
        }, {
            key: '_loadItems',
            value: function _loadItems() {
                var _this6 = this;

                var template = this._options.template;

                if (!template || !template.options) return Promise.resolve();
                var items = template.options.items;

                if (!items) return Promise.resolve();
                var ks = Object.keys(items);
                var loaders = ks.map(function (k) {
                    return items[k].view ? _this6._loader : _this6.app.createLoader(items[k].module.path, items[k].module.loader);
                });
                return Promise.all(ks.map(function (k, i) {
                    return loaders[i].load(items[k].view ? items[k].view : 'index');
                })).then(function (data) {
                    return Promise.all(ks.map(function (k, i) {
                        _this6.items[k] = {
                            type: items[k].view ? 'view' : 'module',
                            options: data[i],
                            loader: loaders[i]
                        };
                    }));
                });
            }
        }]);
        return Module;
    }(Renderable);

    var Application = function () {
        function Application(options) {
            classCallCheck(this, Application);

            this.options = Object.assign({
                stages: ['init', 'template', 'default'],
                scriptRoot: 'app',
                entry: 'viewport'
            }, options);
        }

        createClass(Application, [{
            key: 'createLoader',
            value: function createLoader(path, loader) {
                return new Loader(this, path, []);
            }
        }, {
            key: 'start',
            value: function start() {
                var _this = this;

                var loader = void 0;
                var _options = this.options,
                    entry = _options.entry,
                    container = _options.container;

                if (typeof entry === 'string') {
                    loader = this.createLoader(entry);
                } else {
                    loader = this.createLoader(entry.path, entry.loader);
                }
                return loader.load('index').then(function (opt) {
                    var v = new Module(_this, loader, opt);
                    return v._init().then(function () {
                        return v._render(container);
                    });
                });
            }
        }]);
        return Application;
    }();

    var StaticNode = function (_Node) {
        inherits(StaticNode, _Node);

        function StaticNode(name) {
            var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var id = arguments[2];
            classCallCheck(this, StaticNode);

            var _this = possibleConstructorReturn(this, (StaticNode.__proto__ || Object.getPrototypeOf(StaticNode)).call(this, id));

            _this.name = name;
            _this.attributes = attributes;
            return _this;
        }

        createClass(StaticNode, [{
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                /* FIXME
                if (this.nextSibling && this.nextSibling.element) {
                    this.parent.element.insertBefore(this.element, this.nextSibling.element)
                } else {
                    this.parent.element.appendChild(this.element)
                }*/
                this.parent.element.appendChild(this.element);
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
                this.parent.element.removeChild(this.element);
                this.rendered = false;
            }
        }, {
            key: 'create',
            value: function create() {
                var element = document.createElement(this.name);
                this.attributes.forEach(function (it) {
                    return element.setAttribute(it[0], it[1]);
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
                    console.log(to, v, current);
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
            _this.events = {};
            _this.actions = {};
            _this.bindings = [];
            return _this;
        }

        createClass(DynamicNode, [{
            key: 'attribute',
            value: function attribute(name) {
                for (var _len = arguments.length, helpers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    helpers[_key - 1] = arguments[_key];
                }

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
                        if (it instanceof DelayTransfomer) {
                            it.init(view);
                        }
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
                    var vs = _this5.dynamicAttributes[it].map(function (i) {
                        return i.render(context);
                    });
                    if (vs.some(function (i) {
                        return i[0] === ChangeType.CHANGED;
                    })) {
                        var vvs = vs.map(function (i) {
                            return i[1];
                        });
                        var v = it === 'class' ? vvs.join(' ') : vvs.join(''); // TODO boolean attribute can be set to string?
                        _this5.element.setAttribute(it, v);
                    }
                });
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                if (!this.rendered) return;
                this.updateAttributes(context);
                this.context = context;
                this.bindingHooks.forEach(function (it) {
                    return it.update(context);
                });
                this.children.forEach(function (it) {
                    return it.update(context, delay);
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
                this.bindingHooks = [];
                this.actionHooks = [];
                this.eventHooks = [];
            }
        }]);
        return DynamicNode;
    }(StaticNode);

    var TextNode = function (_Node) {
        inherits(TextNode, _Node);

        function TextNode() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            classCallCheck(this, TextNode);

            var _this = possibleConstructorReturn(this, (TextNode.__proto__ || Object.getPrototypeOf(TextNode)).call(this));

            _this.helpers = text;
            return _this;
        }

        createClass(TextNode, [{
            key: 'init',
            value: function init(root) {
                this.node = document.createTextNode('');
                if (root instanceof View) {
                    this.helpers.forEach(function (it) {
                        if (it instanceof DelayTransfomer) {
                            it.init(root);
                        }
                    });
                }
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                if (this.rendered) return;
                this.rendered = true;
                if (this.nextSibling && this.nextSibling.element) {
                    this.parent.element.insertBefore(this.node, this.nextSibling.element);
                } else {
                    this.parent.element.appendChild(this.node);
                }
                this.update(context, delay);
            }
        }, {
            key: 'update',
            value: function update(context, delay) {
                var r = this.helpers.map(function (h) {
                    return h.render(context);
                });
                if (r.some(function (rr) {
                    return rr[0] === ChangeType.CHANGED;
                })) {
                    this.node.data = r.map(function (rr) {
                        return rr[1];
                    }).join(' ');
                }
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                if (!this.rendered) return;
                this.parent.element.removeChild(this.node);
                this.rendered = false;
            }
        }, {
            key: 'create',
            value: function create() {
                return null;
            }
        }]);
        return TextNode;
    }(Node);

    var ReferenceNode = function (_Node) {
        inherits(ReferenceNode, _Node);

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
                    delay.add(root._module.createItem(this.name).then(fn));
                } else {
                    delay.add(root.createItem(this.name).then(fn));
                }
                this.children.forEach(function (it) {
                    var name = 'default';
                    if (it instanceof StaticNode) {
                        var attr = it.attributes.find(function (n) {
                            return n[0] === 'region';
                        });
                        if (attr) name = attr[1];
                    }
                    if (!_this2.grouped[name]) _this2.grouped[name] = [];
                    _this2.grouped[name].push(it);
                });
            }
        }, {
            key: 'render',
            value: function render(context, delay) {
                var _this3 = this;

                delay.add(this.item.set(this.bindings.reduce(function (acc, item) {
                    acc[item[1]] = context[item[0]];
                    return acc;
                }, {})));
                delay.add(this.item._render(this.parent.element, this.nextSibling && this.nextSibling.element).then(function () {
                    return Promise.all(Object.keys(_this3.grouped).map(function (k) {
                        return _this3.item.regions[k]._showNode(_this3.grouped[k], context);
                    }));
                }));
                this.context = context;
                var cbs = [];
                if (this.item instanceof Module) {
                    var m = this.item;
                    cbs = cbs.concat(this.bindEvents(this.root, m, context));
                    if (this.root instanceof View) {
                        cbs = cbs.concat(this.bindActions(this.root, m, context));
                    }
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
                    acc[item[1]] = context[item[0]];
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
        }, {
            key: 'create',
            value: function create() {
                return null;
            }
        }]);
        return ReferenceNode;
    }(Node);

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
                this.children.forEach(function (it) {
                    it.parent = _this2.parent;
                    it.nextSibling = _this2.nextSibling;
                    it.init(root, delay);
                });
                var me = this;
                root.regions[this.id] = {
                    show: function show(item) {
                        return me.show(item);
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
                this.nodes = nodes;
                return this.close().then(function () {
                    return Delay.also(function (d) {
                        return _this3.nodes.forEach(function (it) {
                            return it.render(context, d);
                        });
                    });
                });
            }
        }, {
            key: 'show',
            value: function show(item) {
                var _this4 = this;

                if (!this.rendered) return;
                this.item = item;
                return this.close().then(function () {
                    return item._render(_this4.parent.element, _this4.nextSibling && _this4.nextSibling.element); // TODO
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
        }, {
            key: 'create',
            value: function create() {
                return null;
            }
        }]);
        return RegionNode;
    }(Node);

    var helpers = {
        echo: EchoHelper, if: IfHelper, unless: UnlessHelper, eq: EqHelper, gt: GtHelper,
        lt: LtHelper, gte: GteHelper, lte: LteHelper, concat: ConcatHelper, ne: NeHelper
    };
    var blocks = {
        if: IfBlock, unless: UnlessBlock, each: EachBlock, gt: GtBlock,
        lt: LtBlock, gte: GteBlock, lte: LteBlock, eq: EqBlock, ne: NeBlock
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
        var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var dynamics = arguments[3];
        var binds = arguments[4];
        var events = arguments[5];
        var actions = arguments[6];

        var d = new DynamicNode(name, attributes, id);
        if (dynamics) dynamics.forEach(function (da) {
            return d.attribute.apply(d, [da[0]].concat(toConsumableArray(da[1])));
        });
        if (binds) binds.forEach(function (b) {
            return d.bind(b[0], b[1]);
        });
        if (events) events.forEach(function (e) {
            return d.on(e[0], e[1], e[2]);
        });
        if (actions) actions.forEach(function (a) {
            return d.action(a[0], a[1], a[2]);
        });
        return d;
    };
    var TN = function TN() {
        for (var _len2 = arguments.length, text = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            text[_key2] = arguments[_key2];
        }

        return new TextNode(text);
    };
    var TX = function TX() {
        for (var _len3 = arguments.length, ss = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            ss[_key3] = arguments[_key3];
        }

        return new TextNode([new (Function.prototype.bind.apply(ConcatHelper, [null].concat(toConsumableArray(ss.map(function (it) {
            return SV(it);
        })))))()]);
    };
    var RG = function RG() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
        return new RegionNode(id);
    };
    var REF = function REF(name, id, binds, events, actions) {
        var d = new ReferenceNode(name, id);
        if (binds) binds.forEach(function (b) {
            return d.bind(b[0], b[1]);
        });
        if (events) events.forEach(function (e) {
            return d.on(e[0], e[1], e[2]);
        });
        if (actions) actions.forEach(function (a) {
            return d.action(a[0], a[1], a[2]);
        });
        return d;
    };
    var E = function E(event, method) {
        for (var _len4 = arguments.length, attrs = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
            attrs[_key4 - 2] = arguments[_key4];
        }

        return [event, method, attrs];
    };
    var NDA = function NDA(v) {
        return [null, [1, v]];
    };
    var NSA = function NSA(v) {
        return [null, [0, v]];
    };
    var DA = function DA(name) {
        for (var _len5 = arguments.length, hs = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            hs[_key5 - 1] = arguments[_key5];
        }

        return [name, hs];
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
        return new EchoHelper(DV(n));
    };
    var TR = function TR(n) {
        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
        }

        return new (Function.prototype.bind.apply(DelayTransfomer, [null].concat([n], args)))();
    };
    var HIF = function HIF(n, t, f) {
        return f ? new IfHelper(DV(n), t, f) : new IfHelper(DV(n), t);
    };
    var HEQ = function HEQ() {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
        }

        return new (Function.prototype.bind.apply(EqHelper, [null].concat(args)))();
    };
    var HGT = function HGT() {
        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
        }

        return new (Function.prototype.bind.apply(GtHelper, [null].concat(args)))();
    };
    var HLT = function HLT() {
        for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
        }

        return new (Function.prototype.bind.apply(LtHelper, [null].concat(args)))();
    };
    var HGTE = function HGTE() {
        for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
        }

        return new (Function.prototype.bind.apply(GteHelper, [null].concat(args)))();
    };
    var HLTE = function HLTE() {
        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
        }

        return new (Function.prototype.bind.apply(LteHelper, [null].concat(args)))();
    };
    var HNE = function HNE() {
        for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            args[_key12] = arguments[_key12];
        }

        return new (Function.prototype.bind.apply(NeHelper, [null].concat(args)))();
    };
    var EACH = function EACH(args, trueNode, falseNode) {
        return new EachBlock(args, trueNode, falseNode);
    };
    var IF = function IF(n, trueNode, falseNode) {
        return new IfBlock([DV(n)], trueNode, falseNode);
    };
    var EQ = function EQ(l, r, trueNode, falseNode) {
        return new EqBlock([l, r], trueNode, falseNode);
    };
    var GT = function GT(l, r, trueNode, falseNode) {
        return new GtBlock([l, r], trueNode, falseNode);
    };
    var LT = function LT(l, r, trueNode, falseNode) {
        return new LtBlock([l, r], trueNode, falseNode);
    };
    var GTE = function GTE(l, r, trueNode, falseNode) {
        return new GteBlock([l, r], trueNode, falseNode);
    };
    var LTE = function LTE(l, r, trueNode, falseNode) {
        return new LteBlock([l, r], trueNode, falseNode);
    };
    var NE = function NE(l, r, trueNode, falseNode) {
        return new NeBlock([l, r], trueNode, falseNode);
    };
    var C = function C(parent) {
        for (var _len13 = arguments.length, children = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
            children[_key13 - 1] = arguments[_key13];
        }

        return parent.setChildren(children);
    };
    var drizzle = {
        helpers: helpers, blocks: blocks, loaders: loaders, customEvents: customEvents,
        lifecycles: { module: [], view: [] },
        ModuleTemplate: ModuleTemplate, ViewTemplate: ViewTemplate, Application: Application,
        factory: {
            SN: SN, DN: DN, TN: TN, TX: TX, RG: RG, REF: REF, E: E, NDA: NDA, NSA: NSA, SV: SV, DV: DV, AT: AT, KV: KV, H: H, TR: TR, HIF: HIF, HEQ: HEQ, HGT: HGT, HLT: HLT, HGTE: HGTE, HLTE: HLTE, HNE: HNE,
            EACH: EACH, IF: IF, EQ: EQ, GT: GT, LT: LT, GTE: GTE, LTE: LTE, NE: NE, C: C, DA: DA, A: E, B: KV
        }
    };

    return drizzle;

})));
//# sourceMappingURL=drizzle.js.map
