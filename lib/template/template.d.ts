import { Disposable } from '../drizzle';
import { Node as MNode } from './node';
import { Renderable } from '../renderable';
import { Transformer } from './transformer';
import { DataContext, BindingGroup } from './context';
import { Module } from '../module';
import { View } from '../view';
declare type StaticValue = string | number | boolean;
declare type DynamicValue = string;
export declare enum ValueType {
    STATIC = 0,
    DYNAMIC = 1,
    TRANSFORMER = 2
}
export declare enum ChangeType {
    CHANGED = 0,
    NOT_CHANGED = 1
}
export declare type NormalValue = [ValueType.STATIC, StaticValue] | [ValueType.DYNAMIC, DynamicValue];
export declare type AttributeValue = NormalValue | [ValueType.TRANSFORMER, Transformer];
export declare type Attribute = [string, AttributeValue];
export declare type HelperResult = [ChangeType, any];
export interface Updatable extends Disposable {
    update(context: DataContext): void;
}
export interface Appendable {
    append(el: Node): any;
    remove(el: Node): any;
    before(anchor: Node): Appendable;
}
export declare abstract class Template {
    creator: () => MNode[];
    createLife(): {
        id: number;
        stage: string;
        nodes: MNode[];
        groups: {
            [name: string]: BindingGroup;
        };
        init(this: Renderable<any>): Promise<any>;
        rendered(this: Renderable<any>, data: object): Promise<any>;
        updated(this: Renderable<any>, data: object): Promise<any>;
        destroyed(this: Renderable<any>): Promise<any>;
    };
    abstract create(root: Renderable<any>, groups: {
        [name: string]: BindingGroup;
    }, data?: object): DataContext;
}
export declare class ViewTemplate extends Template {
    create(root: View, groups: {
        [name: string]: BindingGroup;
    }, data?: object): DataContext;
}
export declare class ModuleTemplate extends Template {
    exportedModels: string[];
    constructor(exportedModels: string[]);
    create(root: Module, groups: {
        [name: string]: BindingGroup;
    }, data?: object): DataContext;
}
export {};
