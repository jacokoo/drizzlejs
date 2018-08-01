import { Node } from './node'
import { Renderable } from '../renderable'
import { Delay, AttributeValue, ValueType, getAttributeValue } from './template'

export const Compare: {[key: string]: (v1: any, v2: any) => boolean} = {
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    gt: (v1, v2) => v1 > v2,
    lt: (v1, v2) => v1 < v2,
    gte: (v1, v2) => v1 >= v2,
    lte: (v1, v2) => v1 <= v2
}

export class IfBlock extends Node {
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

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.trueNode.init(root, delay)
        if (this.falseNode) {
            this.falseNode.init(root, delay)
        }
    }

    use (context: object): boolean {
        if (this.args.length === 1) return this.useSingle(context)
        if (this.args.length === 3) return this.useCompare(context)
        throw new Error('if block should have 1 or 3 arguments')
    }

    useCompare (context: object): boolean {
        const op = this.args[1][1] as string
        if (!Compare[op]) {
            throw Error(`${op} is not a valid compare operator, use: eq(===), ne(!==), gt(>), lt(<), gte(>=), lte(<=)`)
        }
        return Compare[op](getAttributeValue(this.args[0], context), getAttributeValue(this.args[1], context))
    }

    useSingle (context: object): boolean {
        if (this.args[0][0] === ValueType.STATIC) {
            // TODO throw
            return false
        }
        return !!getAttributeValue(this.args[0], context)
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true

        this.trueNode.parent = this.parent
        this.trueNode.nextSibling = this.nextSibling
        if (this.falseNode) {
            this.falseNode.parent = this.parent
            this.falseNode.nextSibling = this.nextSibling
        }

        this.current = this.use(context) ? this.trueNode : this.falseNode

        if (this.current) {
            this.current.render(context, delay)
        }
    }

    update (context: object, delay: Delay) {
        if (!this.rendered) return

        const use = this.use(context) ? this.trueNode : this.falseNode
        if (use === this.current) {
            if (use) use.update(context, delay)
            return
        }

        if (this.current) this.current.destroy(delay)
        this.current = use === this.trueNode ? this.trueNode : this.falseNode
        if (this.current) this.current.render(context, delay)
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        if (this.current) this.current.destroy(delay)
        this.rendered = false
    }

    create () {
        return null
    }
}

export class UnlessBlock extends IfBlock {
    use (context: any): boolean {
        return !getAttributeValue(this.args[0], context)
    }
}
