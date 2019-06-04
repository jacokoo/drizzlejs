export enum ChangeType { CHANGED, NOT_CHANGED }
export type HelperResult = [ChangeType, any, any]
export type CustomTransformer = (...args: any[]) => any

export interface State {
    get (key: string): any
    set (key: string, val: any)
    clear (key: string)
}

export interface CustomEvent {
    on (state: State, el: Element, cb: (event: any) => void)
    off (state: State, el: Element, cb: (event: any) => void)
}

export interface Widget {
    create (state: State, el: Node, ...args: any[]): any
    update (state: State, changed: boolean, el: Node, ...args: any[])
    destory (state: State, el: Node)
}

export interface WidgetDef {
    name: string
    args: string[] // helper ids
}

export interface EachState {
    _id: string[]
    _def: EachDef[]
    _state: (string | number)[]
}

export interface EachDef {
    name: string // helper id
    alias: string
    idx?: string
    key?: string
}

type StaticValue = string | number | boolean
type DynamicValue = string
type AttributeName = string

export enum ValueType { STATIC, DYNAMIC, TRANSFORMER }

export type NormalValue = [ValueType.STATIC, StaticValue] | [ValueType.DYNAMIC, DynamicValue]
export type AttributeValue = NormalValue | [ValueType.TRANSFORMER, Transformer]
export type Attribute = [AttributeName, AttributeValue]
