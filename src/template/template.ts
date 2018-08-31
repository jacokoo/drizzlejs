import { Disposable } from '../drizzle'
import { Node as MNode } from './node'
import { Renderable } from '../renderable'
import { Transformer } from './transformer'
import { Delay } from './util'

type StaticValue = string | number | boolean
type DynamicValue = string

export enum ValueType { STATIC, DYNAMIC, TRANSFORMER }
export enum ChangeType { CHANGED, NOT_CHANGED }

export type NormalValue = [ValueType.STATIC, StaticValue] | [ValueType.DYNAMIC, DynamicValue]
export type AttributeValue = NormalValue | [ValueType.TRANSFORMER, Transformer]
export type Attribute = [string, AttributeValue]

export type HelperResult = [ChangeType, any]

export interface Updatable extends Disposable {
    update (context: object): void
}

export interface ComponentHook extends Disposable {
    update (...args: any[]): void
}

export type Component = (node: Node, ...args: any[]) => ComponentHook

export interface Appendable {
    append (el: Node)
    remove (el: Node)
    before (anchor: Node): Appendable
}

export const customEvents = {
    enter (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 13) return
            e.preventDefault()
            cb.call(this, e)
        }
        node.addEventListener('keypress', ee, false)
        return {
            dispose () {
                node.removeEventListener('keypress', ee, false)
            }
        }
    },

    escape (node: HTMLElement, cb: (any) => void): Disposable {
        const ee = function (this: HTMLElement, e) {
            if (e.keyCode !== 27) return
            cb.call(this, e)
        }
        node.addEventListener('keyup', ee, false)
        return {
            dispose () {
                node.removeEventListener('keyup', ee, false)
            }
        }
    }
}

export const components: {[name: string]: Component} = {
}

export abstract class Template {
    creator: () => MNode[]

    createLife () {
        const me = this
        const o = {
            stage: 'template',
            nodes: [] as MNode[],
            init (this: Renderable<any>) {
                o.nodes = me.creator()
                return Delay.also(d => o.nodes.forEach(it => it.init(this, d)))
            },

            beforeRender (this: Renderable<any>) {
                return Delay.also(d => o.nodes.forEach(it => {
                    it.parent = this._target
                    it.render(this._context(), d)
                }))
            },

            updated (this: Renderable<any>) {
                return Delay.also(d => o.nodes.forEach(it => it.update(this._context(), d)))
            },

            destroyed () {
                return Delay.also(d => o.nodes.forEach(it => it.destroy(d)))
            }
        }

        return o
    }
}

export class ViewTemplate extends Template {
}

export class ModuleTemplate extends Template {
    exportedModels: string[] = []

    constructor(exportedModels: string[]) {
        super()
        this.exportedModels = exportedModels
    }
}
