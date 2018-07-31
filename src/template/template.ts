import { Disposable } from '../drizzle'
import { Node, FakeNode } from './node'
import { Renderable } from '../renderable'
import { Lifecycle } from '../lifecycle'

type StaticValue = string | number | boolean
type DynamicValue = string

export enum ValueType { STATIC, DYNAMIC }
export enum ChangeType { CHANGED, NOT_CHANGED }

export type AttributeValue = [ValueType.STATIC, StaticValue] | [ValueType.DYNAMIC, DynamicValue]
export type Attribute = [string, AttributeValue]

export type HelperResult = [ChangeType, any]

export interface Updatable extends Disposable {
    update (context: object): void
}

export class Delay {
    static also (fn: (Delay) => void) {
        const d = new Delay()
        fn(d)
        return d.execute()
    }

    delays: Promise<any>[] = []

    add (p: Promise<any>) {
        this.delays.push(p)
    }

    execute () {
        return Promise.all(this.delays)
    }
}

export function getValue (key: string, context: object): any {
    return key.split('.').reduce((acc, item) => {
        if (acc == null) return null
        return acc[item]
    }, context)
}

export function getAttributeValue(attr: AttributeValue, context: object): any {
    if (attr[0] === ValueType.STATIC) return attr[1]
    return getValue(attr[1] as string, context)
}

export function resolveEventArgument (me: any, context: object, args: Attribute[], event: any): any[] {
    const values = args.map(([name, v]) => {
        if (v[0] === ValueType.STATIC) return v[1]
        const it = v[1] as string
        if (it === 'event') return event
        if (it === 'this') return me
        if (it.slice(0, 6) === 'event.') return event[it.slice(6)]
        if (it.slice(0, 5) === 'this.') return me[it.slice(5)]
        return getValue(it, context)
    })

    const obj = {}
    const result = [obj]

    args.forEach(([name, v], i) => {
        if (name) {
            obj[name] = values[i]
            return
        }

        if (v[0] === ValueType.STATIC) {
            result.push(values[i])
            return
        }

        const ns = (v[1] as string).split('.')
        obj[ns[ns.length - 1]] = values[i]
    })

    return result
}

export const customEvents = {
    enter (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 13) return
            e.preventDefault()
            cb.call(this, e)
        }

        node.addEventListener('keypress', ee, false)

        return {
            dispose () {
                node.removeEventListener('keypress', ee, false)
            }
        }
    }
}

export abstract class Template<T extends Renderable<any>> {
    life: Lifecycle
    nodes: Node[]
    root: T

    init (root: T, delay: Delay) {
        this.root = root
        this.nodes.forEach(it => it.init(root, delay))
    }

    render (context: object, delay: Delay) {
        const container = new FakeNode(this.root._element)
        const next = this.root._nextSibling && new FakeNode(this.root._nextSibling)
        this.nodes.forEach(it => {
            it.parent = container
            it.nextSibling = next
            it.render(context, delay)
        })
    }

    update (context: object, delay: Delay) {
        this.nodes.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        this.nodes.forEach(it => {
            it.destroy(delay)
            it.nextSibling = null
            it.parent = null
        })
    }
}
