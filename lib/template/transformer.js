"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
class Transformer {
    constructor(value, items, end) {
        this.value = value;
        this.items = items || [];
        this.end = end;
    }
    render(context) {
        let v = util_1.getValue(this.value, context);
        v = this.items.reduce((acc, item) => item.render(context, acc), v);
        if (v == null && this.end) {
            return util_1.getAttributeValue(this.end, context);
        }
        return v;
    }
}
exports.Transformer = Transformer;
class TransformerItem {
    constructor(name, args) {
        this.name = name;
        this.args = args || [];
    }
    render(context, v) {
        const fn = context.helper(this.name);
        if (!fn) {
            throw new Error(`no helper found: ${this.name}`);
        }
        const args = this.args.map(it => util_1.getAttributeValue(it, context)).concat(v);
        return fn.apply(null, args);
    }
}
exports.TransformerItem = TransformerItem;
