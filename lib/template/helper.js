"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const template_2 = require("./template");
const if_block_1 = require("./if-block");
const util_1 = require("./util");
class Helper {
    constructor(...args) {
        this.name = '';
        this.args = args;
        this.check();
    }
    render(context) {
        if (!this.current)
            return [template_1.ChangeType.CHANGED, this.renderIt(context)];
        const c = this.current;
        const u = this.renderIt(context);
        if (c !== u) {
            return [template_1.ChangeType.CHANGED, this.current];
        }
        return [template_1.ChangeType.NOT_CHANGED, this.current];
    }
    arg(idx, context) {
        if (!this.args[idx])
            return '';
        return util_1.getAttributeValue(this.args[idx], context);
    }
    check() { }
    assertCount(...numbers) {
        if (!numbers.some(it => it === this.args.length)) {
            throw new Error(`${name} helper should have ${numbers.join(' or ')} arguments`);
        }
    }
    assertDynamic(...numbers) {
        numbers.forEach(it => {
            if (this.args[it][0] === template_2.ValueType.STATIC) {
                throw new Error(`the ${it}th argument of ${name} helper should be dynamic`);
            }
        });
    }
    renderIt(context) {
        this.current = this.doRender(context);
        return this.current;
    }
}
exports.Helper = Helper;
class DelayHelper extends Helper {
    constructor(name, ...args) {
        super(...args);
        this.name = name;
    }
    doRender(context) {
        const fn = context.helper(this.name);
        if (!fn)
            throw new Error(`no helper found: ${this.name}`);
        return fn.apply(null, this.args.map((it, i) => this.arg(i, context)));
    }
}
exports.DelayHelper = DelayHelper;
class EchoHelper extends Helper {
    doRender(context) {
        return this.arg(0, context);
    }
}
exports.EchoHelper = EchoHelper;
class ConcatHelper extends Helper {
    doRender(context) {
        return this.args.map((it, idx) => this.arg(idx, context)).join('');
    }
}
exports.ConcatHelper = ConcatHelper;
class IfHelper extends Helper {
    constructor() {
        super(...arguments);
        this.name = 'if';
    }
    check() {
        this.assertCount(2, 3, 4, 5);
        this.assertDynamic(0);
    }
    doRender(context) {
        return this.arg(this.use(context), context);
    }
    use(context) {
        if (this.args.length <= 3)
            return this.useSingle(context);
        return this.useMultiple(context);
    }
    useSingle(context) {
        return this.arg(0, context) ? 1 : 2;
    }
    useMultiple(context) {
        const op = this.args[1][1];
        if (!if_block_1.Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: ==, !=, >, <, >=, <=`);
        }
        return if_block_1.Compare[op](this.arg(0, context), this.arg(2, context)) ? 3 : 4;
    }
}
exports.IfHelper = IfHelper;
class UnlessHelper extends IfHelper {
    constructor() {
        super(...arguments);
        this.name = 'unless';
    }
    use(context) {
        return this.arg(0, context) ? 2 : 1;
    }
}
exports.UnlessHelper = UnlessHelper;
