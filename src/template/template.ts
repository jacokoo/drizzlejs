import { Disposable } from '../drizzle'

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