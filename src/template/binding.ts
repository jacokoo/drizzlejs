import { Context, EventTarget, DataContext } from './context'
import { getValue } from './value'

export interface Binding {
    bind ()
    update ()
    unbind ()
}

export class InputValue {
    target: string
    fn: (this: EventTarget) => void

    constructor (target: string) {
        this.target = target
        const me = this
        this.fn = function (this: EventTarget) {
            const el = this as any as HTMLInputElement
            const value = el.value
        }
    }

    bind (ctx: Context, el: EventTarget) {
        el.addEventListener('input', this.fn, false)
    }

    update (ctx: Context, el: EventTarget) {
        const ee = this as any as HTMLInputElement
        ee.value = getValue(ctx as DataContext, this.target, el)
    }

    unbind (ctx: Context, el: EventTarget) {
        el.removeEventListener('input', this.fn, false)
    }
}

export class InputChecked {

}

export class Select {

}

export class Group {

}

export class WindowScrollX {

}

export class WindowScrollY {

}
