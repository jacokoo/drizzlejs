import { View, BindingGroup } from '../view'
import { getValue, Updatable } from './template'
import { DynamicNode } from './dynamic-node'

const distruct = (obj: object, key: string) => {
    const ks = key.split('.')
    const name = ks.pop()

    const target = ks.reduce((acc, it) => acc[it], obj)
    return {name, target}
}

const bindIt = <T extends HTMLElement>(
    context: {[name: string]: any}, view: View, to: string, element: T,
    event: string, get: (T) => any, set: (T, any) => void
): Updatable => {
    let current
    const obj = {context}
    const cb = function(this: T) {
        const {name, target} = distruct(obj.context, to)
        current = get(element)

        // bind each key
        if (name === to && context._each && context._each.some(it => it.key === name)) {
            const each = context._each.find(it => it.key === name)
            each.list[each.index] = current
        } else {
            target[name] = current
        }
        view.set({})
    }

    element.addEventListener(event, cb, false)

    const r = {
        dispose () {
            element.removeEventListener(event, cb, false)
        },
        update (ctx: object) {
            obj.context = ctx
            const v = getValue(to, ctx)
            if (v !== current) {
                console.log(to, v, current)

                set(element, v)
                current = v
            }
        }
    }

    r.update(context)
    return r
}

const getSelectValue = (el: HTMLSelectElement) => {
    const opt = el.options[el.selectedIndex || 0]
    return opt && opt.value
}

const setSelectOption = (el: HTMLSelectElement, value) => {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < el.options.length; i ++) {
        const opt = el.options[i]
        if (opt.value === (value + '')) {
            opt.selected = true
            return
        }
    }
}

const bindGroup = (
    context: {[name: string]: any}, view: View, group: BindingGroup, to: string,
    element: HTMLInputElement
): Updatable => {
    const obj = {context}
    let current
    const cb = function(this: HTMLInputElement) {
        if (group.busy) return
        const {name, target} = distruct(obj.context, to)
        current = (group.type === 'radio' ? element.value : group.items
            .filter(it => (it.element as HTMLInputElement).checked)
            .map(it => (it.element as HTMLInputElement).value))

        if (name === to && context._each && context._each.some(it => it.key === name)) {
            const each = context._each.find(it => it.key === name)
            each.list[each.index] = current
        } else {
            target[name] = current
        }
        group.busy = true
        view.set({})
        group.busy = false
    }

    element.addEventListener('change', cb, false)

    const r = {
        dispose () {
            element.removeEventListener('change', cb, false)
        },
        update (ctx: object) {
            obj.context = ctx
            if (group.busy) return
            const v = getValue(to, ctx)
            const its = group.items.map(it => (it.element as HTMLInputElement))

            let changed = false
            if (group.type === 'radio' && v !== current) changed = true
            if (!changed && group.type === 'checkbox' && (v as any[]).some((it, i) => current[i] !== it)) changed = true
            if (!changed) return

            if (group.type === 'radio') {
                its.forEach(it => it.checked = it.value === v + '')
                return
            }

            its.forEach(it => it.checked = (v as any[]).some(vv => vv + '' === it.value))
        }
    }

    r.update(context)
    return r
}

export const bind = (node: DynamicNode, context: object, from: string, to: string): Updatable => {
    const tag = node.name.toLowerCase()
    const element = node.element
    const view = node.root as View
    if ((tag === 'input' || tag === 'textarea') && from === 'value') {
        return bindIt(context, view, to, element, 'input', el => el.value, (el, value) => el.value = value)
    }

    if (tag === 'input' && from === 'checked') {
        return bindIt(context, view, to, element, 'change', el => el.checked, (el, value) => el.checked = value)
    }

    if (tag === 'select' && from === 'value') {
        return bindIt(context, view, to, element, 'change', getSelectValue, setSelectOption)
    }

    if (tag === 'input' && from === 'group') {
        const type = (element as HTMLInputElement).type
        if (type !== 'checkbox' && type !== 'radio') return null
        return bindGroup(context, view, view._groups[to], to, (element as HTMLInputElement))
    }

    return null
}
