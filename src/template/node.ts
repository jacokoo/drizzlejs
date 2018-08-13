import { Renderable, RenderOptions } from '../renderable'
import { Delay, Appendable, createAppendable } from './template'

export abstract class Node {
    root: Renderable<RenderOptions>
    id: string
    element: HTMLElement
    parent: Appendable
    children: Node[] = []
    rendered: boolean = false

    constructor(id?: string) {
        this.id = id
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.element = this.create()
        if (this.id && this.element) root.ids[this.id] = this.element
        const a = createAppendable(this.element)
        this.children.forEach(it => {
            it.parent = a
            it.init(root, delay)
        })
    }

    render (context: object, delay: Delay) {
    }

    update (context: object, delay: Delay) {
    }

    destroy (delay: Delay) {
        if (this.id) delete this.root.ids[this.id]
        this.children.forEach(it => it.destroy(delay))
    }

    setChildren (children: Node[]) {
        this.children = children
    }

    clearHelper () {
        this.children.forEach(it => it.clearHelper())
    }

    create () {
        return null
    }
}
