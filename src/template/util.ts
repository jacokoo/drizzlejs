import { AttributeValue, ValueType, Attribute, Appendable } from './template'
import { DataContext } from './context'
import { Transformer } from './transformer'

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

export function getValue (key: string, context: DataContext): any {
    const ks = tokenize(key)
    const first = ks.shift()
    let ctx
    const data = context.data
    const computed = context.computed(first)
    if (computed) {
        ctx = computed(data)
    } else {
        ctx = data[first]
    }

    if (ks.length) {
        ctx = ks.reduce((acc, item) => {
            if (acc == null) return null
            return acc[item]
        }, ctx)
    }

    return ctx
}

export function getAttributeValue(attr: AttributeValue, context: DataContext): any {
    if (attr[0] === ValueType.STATIC) return attr[1]
    if (attr[0] === ValueType.DYNAMIC) return getValue(attr[1] as string, context)
    return (attr[1] as Transformer).render(context)
}

export function resolveEventArgument (me: any, context: DataContext, args: Attribute[], event: any): any[] {
    const o = Object.assign({}, context.data, {event, this: me})
    const sub = context.sub(o)
    const values = args.map(([name, v]) => getAttributeValue(v, sub))

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
