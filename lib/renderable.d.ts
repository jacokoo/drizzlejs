import { Lifecycle, LifecycleContainer } from './lifecycle';
import { Application } from './application';
import { Disposable } from './drizzle';
import { Node } from './template/node';
import { Appendable, ModuleTemplate } from './template/template';
export interface RenderOptions extends Lifecycle {
    cycles?: Lifecycle[];
    customEvents?: {
        [name: string]: (HTMLElement: any, callback: (any: any) => void) => Disposable;
    };
    events?: {
        [name: string]: (...args: any[]) => void;
    };
    template?: ModuleTemplate;
    computed?: {
        [name: string]: (any: any) => any;
    };
    actions?: {
        [name: string]: (cb: (data: any) => Promise<any>, data: object) => void;
    };
    _file?: string;
}
export declare enum ComponentState {
    CREATED = 0,
    INITED = 1,
    RENDERED = 2
}
export interface Region {
    item: Renderable<any>;
    show(name: string, state: object): Promise<Renderable<any>>;
    close(): Promise<any>;
    _showNode(nodes: Node[], context: object): Promise<any>;
    _showChildren(): any;
}
export declare abstract class Renderable<T extends RenderOptions> extends LifecycleContainer {
    _target: Appendable;
    _options: T;
    ids: {
        [key: string]: HTMLElement | Renderable<T>;
    };
    regions: {
        [key: string]: Region;
    };
    protected _busy: Promise<any>;
    protected _status: ComponentState;
    constructor(app: Application, options: T, ...args: Lifecycle[]);
    _render(target: Appendable): Promise<any>;
    destroy(): Promise<any>;
    _init(): Promise<ComponentState>;
    _event(name: any, ...args: any[]): void;
    _action(name: string, ...data: any[]): void;
    abstract get(name?: string): object;
    abstract _dispatch(name: string, data: any): Promise<any>;
}
