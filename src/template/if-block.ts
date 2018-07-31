import { Node } from './node'
import { Renderable } from '../renderable'
import { Delay, getValue, AttributeValue, ValueType } from './template'

export class IfBlock extends Node {
    args: string[]
    trueNode: Node
    falseNode?: Node
    current: Node

    constructor (args: string[], trueNode: Node, falseNode?: Node) {
        super()
        this.trueNode = trueNode
        this.falseNode = falseNode
        this.args = args
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.trueNode.nextSibling = this.nextSibling
        this.trueNode.init(root, delay)
        if (this.falseNode) {
            this.falseNode.nextSibling = this.nextSibling
            this.falseNode.init(root, delay)
        }
    }

    use (context: object): boolean {
        return !!getValue(this.args[0], context)
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true
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

        this.current = use === this.trueNode ? this.trueNode : this.falseNode
        use.destroy(delay)
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
        return !getValue(this.args[0], context)
    }
}

export class EqBlock extends IfBlock {
    args2: AttributeValue[]

    constructor (args: AttributeValue[], trueNode: Node, falseNode?: Node) {
        super([], trueNode, falseNode)
        this.args2 = args
    }

    getValue2 (arg: AttributeValue, context) {
        if (arg[0] === ValueType.STATIC) return arg[1]
        return getValue(arg[1] as string, context)
    }

    use (context: object): boolean {
        return this.use2(this.getValue2(this.args2[0], context), this.getValue2(this.args2[1], context))
    }

    use2 (v1: any, v2: any): boolean {
        return v1 === v2
    }
}

export class GtBlock extends EqBlock {
    use2 (v1: any, v2: any): boolean {
        return v1 > v2
    }
}

export class GteBlock extends EqBlock {
    use2 (v1: any, v2: any): boolean {
        return v1 >= v2
    }
}

export class LtBlock extends EqBlock {
    use2 (v1: any, v2: any): boolean {
        return v1 < v2
    }
}

export class LteBlock extends EqBlock {
    use2 (v1: any, v2: any): boolean {
        return v1 <= v2
    }
}
