import { HelperResult, ChangeType } from './template'
import { getValue, AttributeValue, ValueType } from './template'
import { View } from '../view'
import { Compare } from './if-block'

export abstract class Helper {
    name: string = ''
    args: AttributeValue[]
    dynamicKeys: string[]
    currentKeys: string[]
    currentValues: string[]

    current: any

    constructor (...args: AttributeValue[]) {
        this.args = args
        this.dynamicKeys = args.filter(it => it[0] === ValueType.DYNAMIC).map(it => it[1] as string)
        this.check()
    }

    clear () {
        this.currentValues = null
    }

    render (context: object): HelperResult {
        if (!this.currentValues) return [ChangeType.CHANGED, this.renderIt(context)]

        const vs = this.currentKeys.map(it => getValue(it, context))  // TODO if changed, will it do get value twice?
        if (vs.some((it, i) => it !== this.currentValues[i])) {
            return [ChangeType.CHANGED, this.renderIt(context)]
        }

        return [ChangeType.NOT_CHANGED, this.current]
    }

    arg (idx: number, context: object): any {
        const arg = this.args[idx]
        if (!arg) return ''
        if (arg[0] === ValueType.STATIC) return arg[1]
        return this.key(arg[1] as string, context)
    }

    key (key: string, context: object): any {
        this.currentKeys.push(key)
        const v = getValue(key, context)
        this.currentValues.push(v)
        return v
    }

    check () {}

    assertCount (...numbers: number[]) {
        if (!numbers.some(it => it === this.args.length)) {
            throw new Error(`${name} helper should have ${numbers.join(' or ')} arguments`)
        }
    }

    assertDynamic (...numbers: number[]) {
        numbers.forEach(it => {
            if (this.args[it][0] !== ValueType.DYNAMIC) {
                throw new Error(`the ${it}th argument of ${name} helper should be dynamic`)
            }
        })
    }

    abstract doRender (context: object): any

    private renderIt (context: object): any {
        this.currentKeys = []
        this.currentValues = []
        this.current = this.doRender(context)
        return this.current
    }
}

export class DelayHelper extends Helper {
    name: string
    fn: (...args: any[]) => any

    constructor(name: string, ...args: AttributeValue[]) {
        super(null, ...args)
        this.name = name
    }

    init (root: View) {
        const {helpers} = root._options
        if (helpers && helpers[this.name]) this.fn = helpers[this.name]
        else throw new Error(`no helper found: ${name}`)
    }

    doRender (context: object): any {
        return this.fn.apply(null, this.args.map((it, i) => this.arg(i, context)))
    }
}

export class EchoHelper extends Helper {
    doRender (context) {
        return this.arg(0, context)
    }
}

export class ConcatHelper extends Helper {
    name = 'concat'

    check () {
        this.currentKeys = this.dynamicKeys
    }

    doRender (context: object): any {
        return this.args.map((it, i) => this.arg(i, context)).join(' ')
    }
}

export class IfHelper extends Helper {
    name = 'if'

    check () {
        this.assertCount(2, 3, 4, 5)
        this.assertDynamic(0)
    }

    doRender (context: object): any {
        return this.arg(this.use(context), context)
    }

    use (context: object): number {
        if (this.args.length <= 3) return this.useSingle(context)
        return this.useMultiple(context)
    }

    useSingle (context): number {
        return this.key(this.dynamicKeys[0], context) ? 1 : 2
    }

    useMultiple (context): number {
        const op = this.args[1][1] as string
        if (!Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: eq(===), ne(!==), gt(>), lt(<), gte(>=), lte(<=)`)
        }

        return Compare[op](this.arg(0, context), this.arg(2, context)) ? 3 : 4
    }
}

export class UnlessHelper extends IfHelper {
    name = 'unless'

    use (context: object): number {
        return this.key(this.dynamicKeys[0], context) ? 2 : 1
    }
}
