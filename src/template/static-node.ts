import { Node } from './node'
import { Delay } from './util'
import { setAttribute } from './attributes'

export class StaticNode extends Node {
    name: string
    attributes: [string, any][] = []

    constructor(name: string, id?: string) {
        super(id)
        this.name = name
        if (name === 'svg') this.inSvg = true
    }

    attribute (name: string, value: any) {
        this.attributes.push([name, value])
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true

        super.render(context, delay)
        this.parent.append(this.element)
        this.children.forEach(it => it.render(context, delay))
    }

    update (context: object, delay: Delay) {
        this.children.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)

        this.parent.remove(this.element)
        this.rendered = false
    }

    create () {
        const element = this.inSvg ?
            document.createElementNS('http://www.w3.org/2000/svg', this.name) :
            document.createElement(this.name)
        this.attributes.forEach(it =>  setAttribute(element, it[0], it[1]))
        return element
    }
}
