import { Disposable } from '../drizzle'
import { Node as MNode } from './node'
import { Renderable } from '../renderable'
import { Transformer } from './transformer'
import { DataContext, ViewDataContext, ModuleDataContext, BindingGroup } from './context'
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

let i = 0
export abstract class Template {
    creator: () => MNode[]

    createLife () {
        const me = this
        const o = {
            id: i ++,
            stage: 'template',
            nodes: [] as MNode[],
            groups: {} as {[name: string]: BindingGroup},

            init (this: Renderable<any>) {
                o.nodes = me.creator()
                const context = me.create(this, o.groups)
                o.nodes.forEach(it => it.init(context))
                return context.end()
            },

            rendered (this: Renderable<any>, data: object) {
                const context = me.create(this, o.groups, data)
                o.nodes.forEach(it => {
                    it.parent = this._target
                    it.render(context)
                })
                return context.end()
            },

            updated (this: Renderable<any>, data: object) {
                const context = me.create(this, o.groups, data)
                o.nodes.forEach(it => it.update(context))
                return context.end()
            },

            destroyed (this: Renderable<any>) {
                const context = me.create(this, o.groups)
                o.nodes.forEach(it => it.destroy(context))
                return context.end()
            }
        }

        return o
    }

    abstract create (root: Renderable<any>, groups: {[name: string]: BindingGroup}, data?: object): DataContext
}

export class ViewTemplate extends Template {
    create (root: View, groups: {[name: string]: BindingGroup}, data: object = {}): DataContext {
        return new ViewDataContext(root, data, groups)
    }
}

export class ModuleTemplate extends Template {
    exportedModels: string[] = []

    constructor(exportedModels: string[]) {
        super()
        this.exportedModels = exportedModels
    }

    create (root: Module, groups: {[name: string]: BindingGroup}, data: object = {}): DataContext {
        return new ModuleDataContext(root, data)
    }
}
