export enum ChangeType { CHANGED, NOT_CHANGED }
export type HelperResult = [ChangeType, any, any]
export type CustomTransformer = (...args: any[]) => any
export type CustomEvent = (isUnbind: boolean, el: Element, cb: (event: any) => void) => void

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
