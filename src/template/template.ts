import { Disposable } from '../drizzle'
import { Node as MNode } from './node'
import { Renderable } from '../renderable'
import { Transformer } from './transformer'
import { DataContext, ViewDataContext, ModuleDataContext } from './context'
import { Module } from '../module'
import { View } from '../view'

type StaticValue = string | number | boolean
type DynamicValue = string

export enum ValueType { STATIC, DYNAMIC, TRANSFORMER }
export enum ChangeType { CHANGED, NOT_CHANGED }

export type NormalValue = [ValueType.STATIC, StaticValue] | [ValueType.DYNAMIC, DynamicValue]
export type AttributeValue = NormalValue | [ValueType.TRANSFORMER, Transformer]
export type Attribute = [string, AttributeValue]

export type HelperResult = [ChangeType, any]

export interface Updatable extends Disposable {
    update (context: DataContext): void
}

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

export abstract class Template {
    creator: () => MNode[]

    createLife () {
        const me = this
        const o = {
            stage: 'template',
            nodes: [] as MNode[],

            init (this: Renderable<any>) {
                o.nodes = me.creator()
                const context = me.create(this)
                o.nodes.forEach(it => it.init(context))
                return context.end()
            },

            beforeRender (this: Renderable<any>) {
                const context = me.create(this)
                o.nodes.forEach(it => {
                    it.parent = this._target
                    it.render(context)
                })
                return context.end()
            },

            updated (this: Renderable<any>) {
                const context = me.create(this)
                o.nodes.forEach(it => it.update(context))
                return context.end()
            },

            destroyed (this: Renderable<any>) {
                const context = me.create(this)
                o.nodes.forEach(it => it.destroy(context))
                return context.end()
            }
        }

        return o
    }

    abstract create (root: Renderable<any>): DataContext
}

export class ViewTemplate extends Template {
    create (root: View): DataContext {
        return new ViewDataContext(root, root._context())
    }
}

export class ModuleTemplate extends Template {
    exportedModels: string[] = []

    constructor(exportedModels: string[]) {
        super()
        this.exportedModels = exportedModels
    }

    create (root: Module): DataContext {
        return new ModuleDataContext(root, root._context())
    }
}
