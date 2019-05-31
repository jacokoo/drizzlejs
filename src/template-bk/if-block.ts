import { Node } from './node'
import { AttributeValue, ValueType } from './template'
import { AnchorNode } from './anchor-node'
import { getAttributeValue } from './util'
import { Context, DataContext } from './context'

export const Compare: {[key: string]: (v1: any, v2: any) => boolean} = {
    '==': (v1, v2) => v1 === v2,
    '!=': (v1, v2) => v1 !== v2,
    '>': (v1, v2) => v1 > v2,
    '<': (v1, v2) => v1 < v2,
    '>=': (v1, v2) => v1 >= v2,
    '<=': (v1, v2) => v1 <= v2
}

export class IfBlock extends AnchorNode {
    args: AttributeValue[]
    trueNode: Node
    falseNode?: Node
    current: Node

    constructor (args: AttributeValue[], trueNode: Node, falseNode?: Node) {
        super()
        this.trueNode = trueNode
        this.falseNode = falseNode
        this.args = args
    }

    init (context: Context) {
        this.trueNode.init(context)
        if (this.falseNode) {
            this.falseNode.init(context)
        }
    }

    use (context: DataContext): boolean {
        if (this.args.length === 1) return this.useSingle(context)
        if (this.args.length === 3) return this.useCompare(context)
        throw new Error('if block should have 1 or 3 arguments')
    }

    useCompare (context: DataContext): boolean {
        const op = this.args[1][1] as string
        if (!Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: ==, !=, >, <, >=, <=`)
        }
        return Compare[op](getAttributeValue(this.args[0], context), getAttributeValue(this.args[2], context))
    }

    useSingle (context: DataContext): boolean {
        if (this.args[0][0] === ValueType.STATIC) {
            return !!this.args[0][1]
        }
        return !!getAttributeValue(this.args[0], context)
    }

    render (context: DataContext) {
        if (this.rendered) return
        this.rendered = true

        super.render(context)

        this.trueNode.parent = this.newParent
        if (this.falseNode) {
            this.falseNode.parent = this.newParent
        }

        this.current = this.use(context) ? this.trueNode : this.falseNode

        if (this.current) {
            this.current.render(context)
        }
    }

    update (context: DataContext) {
        if (!this.rendered) return

        const use = this.use(context) ? this.trueNode : this.falseNode
        if (use === this.current) {
            if (use) use.update(context)
            return
        }

        if (this.current) this.current.destroy(context)
        this.current = use === this.trueNode ? this.trueNode : this.falseNode
        if (this.current) this.current.render(context)
    }

    destroy (context: Context) {
        if (!this.rendered) return
        if (this.current) this.current.destroy(context)
        super.destroy(context)
        this.rendered = false
    }

}

export class UnlessBlock extends IfBlock {
    use (context: any): boolean {
        return !getAttributeValue(this.args[0], context)
    }
}
