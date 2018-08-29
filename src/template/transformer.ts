import { NormalValue } from './template'

export class Transformer {
    value: string
    end: NormalValue
    items: TransformerItem[]

    constructor (value: string, items: TransformerItem[], end?: NormalValue) {
        this.value = value
        this.items = items
        this.end = end
    }
}

export class TransformerItem {
    name: string
    args: NormalValue[]

    constructor(name: string, args: NormalValue[]) {
        this.name = name
        this.args = args
    }
}
