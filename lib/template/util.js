"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
function tokenize(input) {
    let token = '';
    const result = [];
    let inString = false;
    const push = () => {
        if (token)
            result.push(token);
        token = '';
    };
    for (let i = 0; i < input.length; i++) {
        const t = input[i];
        if (inString) {
            if (t === '\\' && input[i + 1] === ']') {
                token += ']';
                i++;
                continue;
            }
            if (t === ']') {
                push();
                inString = false;
                continue;
            }
            token += t;
            continue;
        }
        if (t === '[') {
            push();
            inString = true;
            continue;
        }
        if (t === '.') {
            push();
            continue;
        }
        token += t;
    }
    if (token)
        result.push(token);
    return result;
}
exports.tokenize = tokenize;
function getValue(key, context) {
    const ks = tokenize(key);
    const first = ks.shift();
    let ctx;
    const data = context.data;
    if (data._computed && first in data._computed) {
        ctx = data._computed[first](context);
    }
    else {
        ctx = context[first];
    }
    if (ks.length) {
        ctx = ks.reduce((acc, item) => {
            if (acc == null)
                return null;
            return acc[item];
        }, ctx);
    }
    return ctx;
}
exports.getValue = getValue;
function getAttributeValue(attr, context) {
    if (attr[0] === template_1.ValueType.STATIC)
        return attr[1];
    if (attr[0] === template_1.ValueType.DYNAMIC)
        return getValue(attr[1], context);
    return attr[1].render(context);
}
exports.getAttributeValue = getAttributeValue;
function resolveEventArgument(me, context, args, event) {
    const o = Object.assign({}, context.data, { event, this: me });
    const sub = context.sub(o);
    const values = args.map(([name, v]) => getAttributeValue(v, sub));
    const obj = {};
    const result = [obj];
    let keys = 0;
    args.forEach(([name, v], i) => {
        if (name) {
            keys++;
            obj[name] = values[i];
            return;
        }
        result.push(values[i]);
    });
    if (keys === 0)
        result.shift();
    return result;
}
exports.resolveEventArgument = resolveEventArgument;
function createAppendable(target) {
    if (!target)
        return null;
    const remove = (el) => target.removeChild(el);
    const append = (el) => target.appendChild(el);
    const before = (anchor) => {
        return { remove, before, append: (el) => target.insertBefore(el, anchor) };
    };
    return { append, remove, before };
}
exports.createAppendable = createAppendable;
