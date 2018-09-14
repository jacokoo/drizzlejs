import { HelperResult, ChangeType } from './template'
import { AttributeValue, ValueType } from './template'
import { Compare } from './if-block'
import { getAttributeValue } from './util'
import { DataContext } from './context'

export abstract class Helper {
    name: string = ''
    args: AttributeValue[]
    current: any

    constructor (...args: AttributeValue[]) {
        this.args = args
        this.check()
    }

    render (context: DataContext): HelperResult {
        if (!this.current) return [ChangeType.CHANGED, this.renderIt(context)]

        const c = this.current
        const u = this.renderIt(context)
        if (c !== u) {
            return [ChangeType.CHANGED, this.current]
        }

        return [ChangeType.NOT_CHANGED, this.current]
    }

    arg (idx: number, context: DataContext): any {
        if (!this.args[idx]) return ''
        return getAttributeValue(this.args[idx], context)
    }

    check () {}

    assertCount (...numbers: number[]) {
        if (!numbers.some(it => it === this.args.length)) {
            throw new Error(`${name} helper should have ${numbers.join(' or ')} arguments`)
        }
    }

    assertDynamic (...numbers: number[]) {
        numbers.forEach(it => {
            if (this.args[it][0] === ValueType.STATIC) {
                throw new Error(`the ${it}th argument of ${name} helper should be dynamic`)
            }
        })
    }

    abstract doRender (context: DataContext): any

    private renderIt (context: DataContext): any {
        this.current = this.doRender(context)
        return this.current
    }
}

export class DelayHelper extends Helper {
    constructor(name: string, ...args: AttributeValue[]) {
        super(...args)
        this.name = name
    }

    doRender (context: DataContext): any {
        const fn = context.helper(this.name)
        if (!fn) throw new Error(`no helper found: ${this.name}`)
        return fn.apply(null, this.args.map((it, i) => this.arg(i, context)))
    }
}

export class EchoHelper extends Helper {
    doRender (context) {
        return this.arg(0, context)
    }
}

export class ConcatHelper extends Helper {
    doRender (context) {
        return this.args.map((it, idx) => this.arg(idx, context)).join('')
    }
}

export class IfHelper extends Helper {
    name = 'if'

    check () {
        this.assertCount(2, 3, 4, 5)
        this.assertDynamic(0)
    }

    doRender (context: DataContext): any {
        return this.arg(this.use(context), context)
    }

    use (context: DataContext): number {
        if (this.args.length <= 3) return this.useSingle(context)
        return this.useMultiple(context)
    }

    useSingle (context): number {
        return this.arg(0, context) ? 1 : 2
    }

    useMultiple (context): number {
        const op = this.args[1][1] as string
        if (!Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: ==, !=, >, <, >=, <=`)
        }

        return Compare[op](this.arg(0, context), this.arg(2, context)) ? 3 : 4
    }
}

export class UnlessHelper extends IfHelper {
    name = 'unless'

    use (context: DataContext): number {
        return this.arg(0, context) ? 2 : 1
    }
}
