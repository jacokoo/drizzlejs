import { Helper, DataContext } from './context'
import { getAttributeValue } from './value'
import { AttributeValue, EachState } from './common'

export const Compare: {[key: string]: (v1: any, v2: any) => boolean} = {
    '==': (v1, v2) => v1 === v2,
    '!=': (v1, v2) => v1 !== v2,
    '>': (v1, v2) => v1 > v2,
    '<': (v1, v2) => v1 < v2,
    '>=': (v1, v2) => v1 >= v2,
    '<=': (v1, v2) => v1 <= v2
}

abstract class AbstractHelper implements Helper {
    args: AttributeValue[]

    constructor (args: AttributeValue[]) {
        this.args = args
    }

    arg (idx: number, dc: DataContext, state: EachState): any {
        if (!this.args[idx]) return ''
        return getAttributeValue(dc, this.args[idx], state)
    }

    abstract get (dc: DataContext, state: EachState): any
}

export class BoolHelper extends AbstractHelper {
    get (dc: DataContext, state: EachState): any {
        if (this.args.length === 1) {
            return !!this.arg(0, dc, state)
        }

        const op = this.args[1][1] as string
        if (!Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: ==, !=, >, <, >=, <=`)
        }

        return Compare[op](this.arg(0, dc, state), this.arg(2, dc, state))
    }
}

export class IfHelper extends AbstractHelper {
    bool: string

    constructor (bool: string, args: AttributeValue[]) {
        super(args)
        this.bool = bool
    }

    get (dc: DataContext, state: EachState): any {
        return this.arg(this.use(dc, state), dc, state)
    }

    use (dc: DataContext, state: EachState): number {
        const [, v, ] = dc.get(this.bool, state)
        return v ? 0 : 1
    }
}

export class UnlessHelper extends IfHelper {
    use (dc: DataContext, state: EachState): number {
        const [, v, ] = dc.get(this.bool, state)
        return v ? 1 : 0
    }
}

export class DelayHelper extends AbstractHelper {
    name: string

    constructor(name: string, args: AttributeValue[]) {
        super(args)
        this.name = name
    }

    get (dc: DataContext, state: EachState): any {
        const fn = dc.transformer(this.name)
        if (!fn) throw new Error(`no transformer found: ${this.name}`)
        return fn.apply(null, this.args.map((it, i) => this.arg(i, dc, state)))
    }
}

export class EchoHelper extends AbstractHelper {
    get (dc: DataContext, state: EachState): any {
        return this.arg(0, dc, state)
    }
}

export class ConcatHelper extends AbstractHelper {
    get (dc: DataContext, state: EachState): any {
        return this.args.map((it, idx) => this.arg(idx, dc, state)).join('')
    }
}

export class MultiHelper implements Helper {
    helpers: string[]
    joiner: string

    constructor (joiner: string, helpers: string[]) {
        this.helpers = helpers
        this.joiner = joiner
    }

    get (dc: DataContext, state: EachState): any {
        return this.helpers.map(it => {
            const [, v] = dc.get(it, state)
            return v
        }).join(this.joiner)
    }
}
