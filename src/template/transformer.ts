import { NormalValue, ValueType } from './template'
import { DataContext } from './context'
import { getValue, getAttributeValue } from './util'

export class Transformer {
    value: string
    end: NormalValue
    items: TransformerItem[]

    constructor (value: string, items: TransformerItem[], end?: NormalValue) {
        this.value = value
        this.items = items || []
        this.end = end
    }

    render (context: DataContext): any {
        let v = getValue(this.value, context)
        v = this.items.reduce((acc, item) => item.render(context, acc), v)
        if (v == null && this.end) {
            return getAttributeValue(this.end, context)
        }
        return v
    }
}

export class TransformerItem {
    name: string
    args: NormalValue[]

    constructor(name: string, args: NormalValue[]) {
        this.name = name
        this.args = args || []
    }

    render (context: DataContext, v: any): any {
        const fn = context.helper(this.name)
        if (!fn) {
            throw new Error(`no helper found: ${this.name}`)
        }
        const args = this.args.map(it => getAttributeValue(it, context)).concat(v)
        return fn.apply(null, args)
    }
}
