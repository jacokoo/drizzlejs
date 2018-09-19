import { DynamicNode } from './dynamic-node'
import { Disposable } from '../drizzle'
import { AbstractDataContext } from './context'

export class WindowNode extends DynamicNode {
    constructor (id?: string) {
        super('window', id)
        this.children = []
    }

    init () {}
    dynamicAttribute () {}
    component () {}

    bind (from: string, to: string) {
        if (from !== 'scrollX' && from !== 'scrollY') {
            throw new Error('Can only bind scrollX and scrollY on window object')
        }
        super.bind(from, to)
    }

    bindEvent (el: EventTarget, name: string, cb: (event: any) => void): Disposable {
        return super.bindEvent(window, name, cb)
    }
}

export class ApplicationNode extends DynamicNode {
    constructor (id?: string) {
        super('app', id)
        this.children = []
    }

    init () {}
    dynamicAttribute () {}
    component () {}
    bind () {}

    bindEvent (el: EventTarget, name: string, cb: (event: any) => void): Disposable {
        return (this.context as AbstractDataContext).root.app.on(name, cb)
    }
}
