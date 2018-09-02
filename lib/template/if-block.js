"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const anchor_node_1 = require("./anchor-node");
const util_1 = require("./util");
exports.Compare = {
    '==': (v1, v2) => v1 === v2,
    '!=': (v1, v2) => v1 !== v2,
    '>': (v1, v2) => v1 > v2,
    '<': (v1, v2) => v1 < v2,
    '>=': (v1, v2) => v1 >= v2,
    '<=': (v1, v2) => v1 <= v2
};
class IfBlock extends anchor_node_1.AnchorNode {
    constructor(args, trueNode, falseNode) {
        super();
        this.trueNode = trueNode;
        this.falseNode = falseNode;
        this.args = args;
    }
    init(context) {
        this.trueNode.init(context);
        if (this.falseNode) {
            this.falseNode.init(context);
        }
    }
    use(context) {
        if (this.args.length === 1)
            return this.useSingle(context);
        if (this.args.length === 3)
            return this.useCompare(context);
        throw new Error('if block should have 1 or 3 arguments');
    }
    useCompare(context) {
        const op = this.args[1][1];
        if (!exports.Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: ==, !=, >, <, >=, <=`);
        }
        return exports.Compare[op](util_1.getAttributeValue(this.args[0], context), util_1.getAttributeValue(this.args[2], context));
    }
    useSingle(context) {
        if (this.args[0][0] === template_1.ValueType.STATIC) {
            return !!this.args[0][1];
        }
        return !!util_1.getAttributeValue(this.args[0], context);
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        super.render(context);
        this.trueNode.parent = this.newParent;
        if (this.falseNode) {
            this.falseNode.parent = this.newParent;
        }
        this.current = this.use(context) ? this.trueNode : this.falseNode;
        if (this.current) {
            this.current.render(context);
        }
    }
    update(context) {
        if (!this.rendered)
            return;
        const use = this.use(context) ? this.trueNode : this.falseNode;
        if (use === this.current) {
            if (use)
                use.update(context);
            return;
        }
        if (this.current)
            this.current.destroy(context);
        this.current = use === this.trueNode ? this.trueNode : this.falseNode;
        if (this.current)
            this.current.render(context);
    }
    destroy(context) {
        if (!this.rendered)
            return;
        if (this.current)
            this.current.destroy(context);
        super.destroy(context);
        this.rendered = false;
    }
}
exports.IfBlock = IfBlock;
class UnlessBlock extends IfBlock {
    use(context) {
        return !util_1.getAttributeValue(this.args[0], context);
    }
}
exports.UnlessBlock = UnlessBlock;
