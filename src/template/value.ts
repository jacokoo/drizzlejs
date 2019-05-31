import { DataContext, EventDef, EventTarget } from './context'
import { Transformer } from './transformer'
import { ValueType, AttributeValue, EachState } from './common'

export function resolveEventArguments (ctx: DataContext, me: EventTarget, event: any, def: EventDef): any[] {
    const result = []
    def.attrs.forEach(it => {
        if (it[0] === ValueType.STATIC) {
            result.push(it[1])
            return
        }
        if (it[0] === ValueType.DYNAMIC) {
            const ts = tokenize(it[1])
            const first = ts.shift()
            if (first === 'event' || first === 'this') {
                let o = first === 'event' ? event : me
                o = ts.reduce((acc, key) => {
                    return acc[key]
                }, o)
                result.push(o)
                return
            }
        }
        result.push(getAttributeValue(ctx, it, me))
    })
    return result
}

export function getAttributeValue (ctx: DataContext, av: AttributeValue, state: EachState): any {
    switch (av[0]) {
    case ValueType.STATIC:
        return av[1]
    case ValueType.DYNAMIC:
        return getValue(ctx, av[1], state)
    case ValueType.TRANSFORMER:
        return (av[1] as Transformer).get(ctx, state)
    }
}

export function getValue (ctx: DataContext, key: string, state: EachState) {
    const ks = tokenize(key)
    const first = ks.shift()
    let o = ctx.data
    const computed = ctx.root._options.computed && ctx.root._options.computed[key]
    if (computed) {
        o = computed(o)
    } else {
        let oo: any = o
        if (state._def.some((v, i) => {
            if (v.idx === first) {
                oo = state._state[i]
                return true
            }
            oo = oo[v.name][state._state[i]]
            return v.alias === first
        })) {
            o = oo
        } else {
            o = o[first]
        }
    }

    if (ks.length) {
        o = ks.reduce((acc, item) => {
            if (acc == null) return null
            return acc[item]
        }, o)
    }

    return o
}

const cache: {[key: string]: string[]} = {}

function tokenize(input: string): string[] {
    if (cache[input]) {
        return cache[input].slice()
    }
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

    cache[input] = result
    return result.slice()
}
