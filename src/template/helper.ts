import { HelperResult, ChangeType } from './template'
import { getValue, AttributeValue, ValueType } from './template'

export abstract class Helper {
    name: string = ''
    args: AttributeValue[]
    dynamicKeys: string[]
    currentKeys: string[]
    currentValues: string[]

    constructor (...args: AttributeValue[]) {
        this.args = args
        this.dynamicKeys = args.filter(it => it[0] === ValueType.DYNAMIC).map(it => it[1] as string)
        this.check()
    }

    render (context: object): HelperResult {
        if (!this.currentValues) return [ChangeType.CHANGED, this.renderIt(context)]

        const vs = this.currentKeys.map(it => getValue(it, context))
        if (vs.some((it, i) => it !== this.currentValues[i])) {
            return [ChangeType.CHANGED, this.renderIt(context)]
        }

        return [ChangeType.NOT_CHANGED, undefined]
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
        return this.doRender(context)
    }
}

export class Transfromer extends Helper {
    fn: (...args: any[]) => any

    constructor(fn: (...args: any[]) => any, ...args: AttributeValue[]) {
        super(...args)
        this.fn = fn
    }

    doRender (context: object): any {
        return this.fn.apply(null, this.args.map((it, i) => this.arg(i, context)))
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
        this.assertCount(2, 3)
        this.assertDynamic(0)
    }

    doRender (context: object): any {
        return this.arg(this.use(context), context)
    }

    use (context: object): number {
        return this.key(this.dynamicKeys[0], context) ? 1 : 2
    }
}

export class UnlessHelper extends IfHelper {
    name = 'unless'

    use (context: object): number {
        return this.key(this.dynamicKeys[0], context) ? 2 : 1
    }
}

export class EqHelper extends Helper {
    name: 'eq'

    check () {
        this.assertCount(3, 4)
    }

    doRender (context: object): any {
        return this.arg(this.use(this.arg(0, context), this.arg(1, context)) ? 2 : 3, context)
    }

    use (v1: any, v2: any): boolean {
        return v1 === v2
    }
}

export class GtHelper extends EqHelper {
    use (v1: any, v2: any): boolean {
        return v1 > v2
    }
}

export class GteHelper extends EqHelper {
    use (v1: any, v2: any): boolean {
        return v1 >= v2
    }
}

export class LtHelper extends EqHelper {
    use (v1: any, v2: any): boolean {
        return v1 < v2
    }
}

export class LteHelper extends EqHelper {
    use (v1: any, v2: any): boolean {
        return v1 <= v2
    }
}
