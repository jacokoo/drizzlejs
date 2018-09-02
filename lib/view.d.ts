import { RenderOptions, Renderable, ComponentState } from './renderable';
import { Module } from './module';
import { Component } from './template/context';
export interface ViewOptions extends RenderOptions {
    helpers?: {
        [name: string]: (...any: any[]) => any;
    };
    components?: {
        [name: string]: Component;
    };
}
export declare class View extends Renderable<ViewOptions> {
    _module: Module;
    _state: object;
    constructor(mod: Module, options: ViewOptions);
    readonly regions: {
        [key: string]: import("./renderable").Region;
    };
    _init(): Promise<ComponentState>;
    get(key?: string): any;
    set(data: object, silent?: boolean): Promise<any>;
    _dispatch(name: string, data: any): Promise<any>;
}
