"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
var ValueType;
(function (ValueType) {
    ValueType[ValueType["STATIC"] = 0] = "STATIC";
    ValueType[ValueType["DYNAMIC"] = 1] = "DYNAMIC";
    ValueType[ValueType["TRANSFORMER"] = 2] = "TRANSFORMER";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["CHANGED"] = 0] = "CHANGED";
    ChangeType[ChangeType["NOT_CHANGED"] = 1] = "NOT_CHANGED";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
exports.customEvents = {
    enter(node, cb) {
        const ee = function (e) {
            if (e.keyCode !== 13)
                return;
            e.preventDefault();
            cb.call(this, e);
        };
        node.addEventListener('keypress', ee, false);
        return {
            dispose() {
                node.removeEventListener('keypress', ee, false);
            }
        };
    },
    escape(node, cb) {
        const ee = function (e) {
            if (e.keyCode !== 27)
                return;
            cb.call(this, e);
        };
        node.addEventListener('keyup', ee, false);
        return {
            dispose() {
                node.removeEventListener('keyup', ee, false);
            }
        };
    }
};
class Template {
    createLife() {
        const me = this;
        const o = {
            stage: 'template',
            nodes: [],
            init() {
                o.nodes = me.creator();
                const context = me.create(this);
                o.nodes.forEach(it => it.init(context));
                return context.end();
            },
            beforeRender() {
                const context = me.create(this);
                o.nodes.forEach(it => {
                    it.parent = this._target;
                    it.render(context);
                });
                return context.end();
            },
            updated() {
                const context = me.create(this);
                o.nodes.forEach(it => it.update(context));
                return context.end();
            },
            destroyed() {
                const context = me.create(this);
                o.nodes.forEach(it => it.destroy(context));
                return context.end();
            }
        };
        return o;
    }
}
exports.Template = Template;
class ViewTemplate extends Template {
    create(root) {
        return new context_1.ViewDataContext(root, root._context());
    }
}
exports.ViewTemplate = ViewTemplate;
class ModuleTemplate extends Template {
    constructor(exportedModels) {
        super();
        this.exportedModels = [];
        this.exportedModels = exportedModels;
    }
    create(root) {
        return new context_1.ModuleDataContext(root, root._context());
    }
}
exports.ModuleTemplate = ModuleTemplate;
