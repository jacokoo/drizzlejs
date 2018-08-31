import { Renderable, RenderOptions } from '../renderable'
import { Delay, createAppendable } from './util'
import { Appendable } from './template'

export abstract class Node {
    root: Renderable<RenderOptions>
    id: string
    element: HTMLElement
    parent: Appendable
    children: Node[] = []
    rendered: boolean = false
    inSvg: boolean = false

    constructor(id?: string) {
        this.id = id
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.element = this.create()
        const a = createAppendable(this.element)
        this.children.forEach(it => {
            it.parent = a
            it.init(root, delay)
        })
    }

    render (context: object, delay: Delay) {
        if (this.id && this.element) this.root.ids[this.id] = this.element
    }

    update (context: object, delay: Delay) {
    }

    destroy (delay: Delay) {
        this.children.forEach(it => it.destroy(delay))
        if (this.id) delete this.root.ids[this.id]
    }

    setChildren (children: Node[]) {
        this.children = children
        if (this.inSvg) children.forEach(it => it.setToSvg())
    }

    setToSvg () {
        this.inSvg = true
        this.children.forEach(it => it.inSvg = true)
    }

    clearHelper () {
        this.children.forEach(it => it.clearHelper())
    }

    create () {
        return null
    }
}
