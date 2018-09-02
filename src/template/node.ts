import { createAppendable } from './util'
import { Appendable } from './template'
import { Context, DataContext } from './context'

export abstract class Node {
    id: string
    element: HTMLElement
    parent: Appendable
    children: Node[] = []
    rendered: boolean = false
    inSvg: boolean = false

    constructor(id?: string) {
        this.id = id
    }

    init (context: Context) {
        this.element = this.create()
        const a = createAppendable(this.element)
        this.children.forEach(it => {
            it.parent = a
            it.init(context)
        })
    }

    render (context: DataContext) {
        if (this.id && this.element) context.ref(this.id, this.element)
    }

    update (context: DataContext) {
    }

    destroy (context: Context) {
        this.children.forEach(it => it.destroy(context))
        if (this.id) context.ref(this.id)
    }

    setChildren (children: Node[]) {
        this.children = children
        if (this.inSvg) children.forEach(it => it.setToSvg())
    }

    setToSvg () {
        this.inSvg = true
        this.children.forEach(it => it.inSvg = true)
    }

    create () {
        return null
    }
}
