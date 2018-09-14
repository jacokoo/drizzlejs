"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const updateSingleKey = (context, to, value) => {
    const data = context.data;
    if (data._each) {
        const each = data._each.find(it => it.key === to);
        if (each) {
            each.list[each.index] = value;
            context.update({ [each.name]: each.list });
            return;
        }
    }
    context.update({ [to]: value });
};
const updateView = (context, to, value) => {
    const ps = util_1.tokenize(to);
    if (ps.length === 1)
        return updateSingleKey(context, to, value);
    const root = ps.shift();
    const last = ps.pop();
    const result = {};
    let obj;
    let isEach = false;
    const data = context.data;
    if (data._each) {
        const each = data._each.find(it => it.key === root);
        if (each) {
            const first = data._each[0];
            result[first.name] = first.list;
            obj = each.list[each.index];
            isEach = true;
        }
    }
    if (!isEach) {
        result[root] = context[root];
        obj = result[root];
    }
    result[root] = context[root];
    obj = ps.reduce((acc, it) => acc[it], obj);
    obj[last] = value;
    context.update(result);
};
const bindIt = (context, to, element, event, get, set) => {
    let current;
    const obj = { context };
    const cb = function () {
        current = get(element);
        updateView(obj.context, to, current);
    };
    element.addEventListener(event, cb, false);
    const r = {
        dispose() {
            element.removeEventListener(event, cb, false);
        },
        update(ctx) {
            obj.context = ctx;
            const v = util_1.getValue(to, ctx);
            if (v !== current) {
                set(element, v);
                current = v;
            }
        }
    };
    r.update(context);
    return r;
};
const getSelectValue = (el) => {
    const opt = el.options[el.selectedIndex || 0];
    return opt && opt.value;
};
const setSelectOption = (el, value) => {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < el.options.length; i++) {
        const opt = el.options[i];
        if (opt.value === (value + '')) {
            opt.selected = true;
            return;
        }
    }
};
const bindGroup = (context, group, to, element) => {
    const obj = { context };
    let current;
    const cb = function () {
        if (group.busy)
            return;
        current = (group.type === 'radio' ? element.value : group.items
            .filter(it => it.element.checked)
            .map(it => it.element.value));
        updateView(obj.context, to, current);
    };
    element.addEventListener('change', cb, false);
    const r = {
        dispose() {
            element.removeEventListener('change', cb, false);
        },
        update(ctx) {
            obj.context = ctx;
            if (group.busy)
                return;
            const v = util_1.getValue(to, ctx);
            const its = group.items.map(it => it.element);
            let changed = false;
            if (group.type === 'radio' && v !== current)
                changed = true;
            if (!changed && group.type === 'checkbox' &&
                v.some((it, i) => !current || current[i] !== it))
                changed = true;
            if (!changed)
                return;
            if (group.type === 'radio') {
                its.forEach(it => it.checked = it.value === v + '');
                return;
            }
            its.forEach(it => it.checked = v.some(vv => vv + '' === it.value));
        }
    };
    r.update(context);
    return r;
};
exports.bind = (node, context, from, to) => {
    const tag = node.name.toLowerCase();
    const element = node.element;
    if ((tag === 'input' || tag === 'textarea') && from === 'value') {
        return bindIt(context, to, element, 'input', el => el.value, (el, value) => el.value = value == null ? '' : value);
    }
    if (tag === 'input' && from === 'checked') {
        return bindIt(context, to, element, 'change', el => el.checked, (el, value) => el.checked = value);
    }
    if (tag === 'select' && from === 'value') {
        return bindIt(context, to, element, 'change', getSelectValue, setSelectOption);
    }
    if (tag === 'input' && from === 'group') {
        const type = element.type;
        if (type !== 'checkbox' && type !== 'radio')
            return null;
        return bindGroup(context, context.groups[to], to, element);
    }
    return null;
};