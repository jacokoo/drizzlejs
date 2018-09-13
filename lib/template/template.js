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
let i = 0;
class Template {
    createLife() {
        const me = this;
        const o = {
            id: i++,
            stage: 'template',
            nodes: [],
            groups: {},
            init() {
                o.nodes = me.creator();
                const context = me.create(this, o.groups);
                o.nodes.forEach(it => it.init(context));
                return context.end();
            },
            rendered(data) {
                const context = me.create(this, o.groups, data);
                o.nodes.forEach(it => {
                    it.parent = this._target;
                    it.render(context);
                });
                return context.end();
            },
            updated(data) {
                const context = me.create(this, o.groups, data);
                o.nodes.forEach(it => it.update(context));
                return context.end();
            },
            destroyed() {
                const context = me.create(this, o.groups);
                o.nodes.forEach(it => it.destroy(context));
                return context.end();
            }
        };
        return o;
    }
}
exports.Template = Template;
class ViewTemplate extends Template {
    create(root, groups, data = {}) {
        return new context_1.ViewDataContext(root, data, groups);
    }
}
exports.ViewTemplate = ViewTemplate;
class ModuleTemplate extends Template {
    constructor(exportedModels) {
        super();
        this.exportedModels = [];
        this.exportedModels = exportedModels;
    }
    create(root, groups, data = {}) {
        return new context_1.ModuleDataContext(root, data);
    }
}
exports.ModuleTemplate = ModuleTemplate;
