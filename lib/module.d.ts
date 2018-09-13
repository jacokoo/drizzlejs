import { RenderOptions, Renderable, ComponentState } from './renderable';
import { StoreOptions } from './store';
import { Application } from './application';
import { Loader } from './loader';
import { View, ViewOptions } from './view';
import { Disposable } from './drizzle';
import { Appendable } from './template/template';
export interface ItemOptions {
    views?: string[];
    refs?: string[];
    modules?: {
        [name: string]: string;
    };
}
export interface ModuleOptions extends RenderOptions {
    store?: StoreOptions;
    items?: ItemOptions;
}
interface ModuleRenference {
    [name: string]: {
        loader: string;
        path: string;
        args?: any;
    };
}
export declare const moduleReferences: ModuleRenference;
export declare class Module extends Renderable<ModuleOptions> {
    _items: {
        [key: string]: {
            type: 'view' | 'module';
            options: ModuleOptions | ViewOptions;
            loader: Loader;
        };
    };
    _extraState: object;
    private _store;
    private _handlers;
    private _loader;
    constructor(app: Application, loader: Loader, options: ModuleOptions, extraState?: object);
    set(data: object): Promise<any>;
    get(name?: string): any;
    on(name: string, handler: (data: any) => void): Disposable;
    fire(name: string, data: any): void;
    _createItem(name: string, state?: object): Promise<View | Module>;
    _dispatch(name: string, payload?: any): Promise<any>;
    _render(target: Appendable): Promise<any>;
    _init(): Promise<ComponentState>;
    private _loadItems;
}
export {};
