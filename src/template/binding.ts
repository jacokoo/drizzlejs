import { Context, EventTarget, DataContext } from './context'
import { getValue, tokenize } from './value'
import { EachState } from './common'

export interface Binding {
    id: string
    bind (el: EventTarget)
    update (el: EventTarget)
    unbind (el: EventTarget)
}

class AbstractBinding implements Binding {
    id: string
    target: string
    event: string
    setter: (el: HTMLElement, value: any) => void
    fn: (this: EventTarget) => void

    constructor (
        id: string, target: string, event: string,
        get: (el: HTMLElement) => any, set: (el: HTMLElement, value: any) => void
    ) {
        this.id = id
        this.target = target
        this.event = event
        this.setter = set

        this.fn = function (this: EventTarget) {
            const el = this as any as HTMLElement
            const ctx = this._ctx as DataContext
            ctx.update(genUpdate(this, ctx.data, target, get(el)))
        }
    }

    bind (el: EventTarget) {
        el.addEventListener(this.event, this.fn, false)
    }

    update (el: EventTarget) {
        const ee = this as any as HTMLElement
        this.setter(ee, getValue(el._ctx as DataContext, this.target, el))
    }

    unbind (el: EventTarget) {
        el.removeEventListener(this.event, this.fn, false)
    }
}

export class InputValue extends AbstractBinding {
    constructor (id: string, target: string) {
        const get = (el: HTMLElement) => (el as HTMLInputElement).value
        const set = (el: HTMLElement, value: any) => (el as HTMLInputElement).value = value
        super(id, target, 'input', get, set)
    }
}

export class InputChecked extends AbstractBinding {
    constructor (id: string, target: string) {
        const get = (el: HTMLElement) => (el as HTMLInputElement).checked
        const set = (el: HTMLElement, value: any) => (el as HTMLInputElement).checked = value
        super(id, target, 'change', get, set)
    }
}

export class Select extends AbstractBinding {
    constructor (id: string, target: string) {
        super(id, target, 'change', getSelectValue, setSelectOption)
    }
}

export class WindowScrollX extends AbstractBinding {
    constructor (id: string, target: string) {
        const get = (el: HTMLElement) => (el as any as Window).pageXOffset
        const set = (el: HTMLElement, value: any) => {
            const w = (el as any as Window)
            w.scrollTo(value, w.pageYOffset)
        }
        super(id, target, 'scroll', get, set)
    }
}

export class WindowScrollY extends AbstractBinding {
    constructor (id: string, target: string) {
        const get = (el: HTMLElement) => (el as any as Window).pageYOffset
        const set = (el: HTMLElement, value: any) => {
            const w = (el as any as Window)
            w.scrollTo(w.pageXOffset, value)
        }
        super(id, target, 'scroll', get, set)
    }
}

export class RadioGroup extends AbstractBinding {
    constructor (id: string, target: string) {
        const get = (el: HTMLElement) => (el as HTMLInputElement).value
        const set = (el: HTMLElement, value: any) => {
            const ee = el as HTMLInputElement
            ee.checked = ee.value === value + ''
        }
        super(id, target, 'change', get, set)
    }
}

export class CheckGroup implements Binding {
    id: string
    target: string
    fn: (this: EventTarget) => void

    constructor (id: string, target: string) {
        this.id = id
        this.target = target

        this.fn = function (this: EventTarget) {
            const ctx = this._ctx as DataContext
            const c = ctx.cache.get(id)
            if (!c) return
            const v = c.filter(it => it.checked).map(it => it.value)
            ctx.update(genUpdate(this, ctx.data, target, v))
        }
    }

    bind (el: EventTarget) {
        let c = el._ctx.cache.get(this.id)
        if (!c) {
            c = []
            c.push(el)
        }
        el.addEventListener('change', this.fn, false)
    }

    update (el: EventTarget) {
        const v = getValue(el._ctx as DataContext, this.target, el)
        const ee = el as any as HTMLInputElement
        ee.checked = v.indexOf(ee.value) !== -1
    }

    unbind (el: EventTarget) {
        const c = el._ctx.cache.get(this.id)
        if (!c) return
        c.splice(c.indexOf(el), 1)
        if (!c.length) el._ctx.cache.clear(this.id)
        el.removeEventListener('change', this.fn, false)
    }
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

function setValue(data: object, tks: string[], value: any): object {
    if (!tks.length) return value
    tks.reduce((acc, it, i) => {
        if (i === tks.length) {
            acc[it] = value
            return
        }

        if (!acc[it]) acc[it] = {}
        return acc[it]
    }, data)
    return data
}

function genUpdate(state: EachState, data: object, key: string, value: any): object {
    const [first, ...tail] = tokenize(key)
    const idx = state._def.findIndex(it => it.alias === first)

    if (idx === -1) {
        return {[first]: setValue(data[first], tail, value)}
    }

    const list = data[state._def[0].name]
    let o = data
    for (let i = 0; i < idx; i ++) {
        o = data[state._def[i].name][state._state[i]]
    }
    const list2 = o[state._def[idx].name]
    list2[state._state[idx]] = setValue(list2[state._state[idx]], tail, value)
    return {[first]: list}
}
