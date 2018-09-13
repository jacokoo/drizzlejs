import { StaticNode } from './static-node';
import { Helper } from './helper';
import { Disposable } from '../drizzle';
import { Attribute, ChangeType, Updatable } from './template';
import { ComponentHook, Context, DataContext } from './context';
export declare class DynamicNode extends StaticNode {
    dynamicAttributes: {
        [name: string]: Helper[];
    };
    components: {
        [name: string]: Helper[];
    };
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
    bindings: [string, string][];
    eventHooks: Disposable[];
    actionHooks: Disposable[];
    bindingHooks: Updatable[];
    componentHooks: [string, ComponentHook][];
    context: DataContext;
    dynamicAttribute(name: string, helpers: Helper[]): void;
    on(event: string, method: string, args?: Attribute[]): void;
    action(event: string, method: string, args?: Attribute[]): void;
    bind(from: string, to: string): void;
    component(name: string, helpers: Helper[]): void;
    init(context: Context): void;
    render(context: DataContext): void;
    initEvent(name: string, method: string, args: Attribute[]): Disposable;
    initAction(name: string, action: string, args: Attribute[]): Disposable;
    bindEvent(name: string, cb: (event: any) => void): Disposable;
    updateAttributes(context: DataContext): void;
    renderHelper(context: DataContext, helpers: Helper[]): [ChangeType, any[]];
    update(context: DataContext): void;
    destroy(context: Context): void;
}
