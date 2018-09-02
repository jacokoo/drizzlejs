import { Node } from './node';
import { Attribute } from './template';
import { Module } from '../module';
import { View } from '../view';
import { Disposable } from '../drizzle';
import { AnchorNode } from './anchor-node';
import { Context, DataContext } from './context';
interface BindResult {
    fn: (any: any) => void;
    event: string;
}
export declare class ReferenceNode extends AnchorNode {
    name: string;
    item: Module | View;
    events: {
        [event: string]: {
            method: string;
            args: Attribute[];
        };
    };
    actions: {
        [event: string]: {
            method: string;
            args: Attribute[];
        };
    };
    mappings: [string, string][];
    grouped: {
        [name: string]: Node[];
    };
    statics: {
        [name: string]: any;
    };
    hooks: Disposable[];
    context: DataContext;
    constructor(name: string, id?: string);
    attribute(name: string, value: any): void;
    map(from: string, to?: string): void;
    on(event: string, method: string, args: Attribute[]): void;
    action(event: string, method: string, args: Attribute[]): void;
    init(context: Context): void;
    render(context: DataContext): void;
    bindEvents(context: DataContext): BindResult[];
    bindActions(context: DataContext): BindResult[];
    update(context: DataContext): void;
    destroy(delay: Context): void;
}
export {};
