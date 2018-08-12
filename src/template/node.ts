import { Renderable, RenderOptions } from '../renderable'
import { Delay } from './template'

export abstract class Node {
    root: Renderable<RenderOptions>
    id: string
    element: HTMLElement
    parent: Node
    children: Node[] = []
    nextSibling: Node
    rendered: boolean = false

    constructor(id?: string) {
        this.id = id
    }

    init (root: Renderable<any>, delay: Delay) {
        this.root = root
        this.element = this.create()
        if (this.id) root.ids[this.id] = this.element
        this.children.forEach(it => it.init(root, delay))
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
        children.forEach((it, i) => {
            it.nextSibling = children[i + 1]
            it.parent = this
        })
    }

    clearHelper () {
        this.children.forEach(it => it.clearHelper())
    }

    abstract create (): HTMLElement
}

export class FakeNode extends Node {
    constructor(el: HTMLElement) {
        super()
        this.element = el
    }

    init () {
    }

    create () {
        return this.element
    }
}
