import { AttributeValue, ValueType, Attribute, Appendable } from './template'

export function tokenize(input: string): string[] {
    let token = ''
    const result = [] as string[]
    let inString = false

    const push = () => {
        if (token) result.push(token)
        token = ''
    }

    for (let i = 0; i < input.length; i++) {
        const t = input[i]
        if (inString) {
            if (t === '\\' && input[i + 1] === ']') {
                token += ']'
                i++
                continue
            }
            if (t === ']') {
                push()
                inString = false
                continue
            }
            token += t
            continue
        }

        if (t === '[') {
            push()
            inString = true
            continue
        }

        if (t === '.') {
            push()
            continue
        }
        token += t
    }

    if (token) result.push(token)

    return result
}

export function getValue (key: string, context: any): any {
    const ks = tokenize(key)
    const first = ks.shift()
    let ctx
    if (context._computed && first in context._computed) {
        ctx = context._computed[first](context)
    } else {
        ctx = context[first]
    }

    if (ks.length) {
        ctx = ks.reduce((acc, item) => {
            if (acc == null) return null
            return acc[item]
        }, ctx)
    }

    return ctx
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
    let keys = 0

    args.forEach(([name, v], i) => {
        if (name) {
            keys ++
            obj[name] = values[i]
            return
        }
        result.push(values[i])
    })

    if (keys === 0) result.shift()
    return result
}

export function createAppendable (target: Node): Appendable {
    if (!target) return null
    const remove = (el: Node) => target.removeChild(el)
    const append = (el: Node) => target.appendChild(el)
    const before = (anchor: Node) => {
        return {remove, before, append: (el: Node) => target.insertBefore(el, anchor)}
    }
    return {append, remove, before}
}

export class Delay {
    static also (fn: (Delay) => void) {
        const d = new Delay()
        fn(d)
        return d.execute()
    }

    busy = Promise.resolve()

    add (p: Promise<any>) {
        this.busy = this.busy.then(() => p)
    }

    execute () {
        return this.busy
    }
}
