import { Module } from './module';
interface DefaultHandler {
    enter(args: object): Promise<Router>;
    update?(args: object): Promise<any>;
    leave?(): Promise<any>;
}
interface ActionHandler {
    action: string;
}
interface ModuleHandler {
    ref: string;
    region?: string;
    model?: string;
}
declare type Handler = DefaultHandler | ActionHandler | ModuleHandler | string;
export interface RouteOptions {
    [route: string]: Handler;
}
export declare class Router {
    private _module;
    private _keys;
    private _defs;
    private _currentKey;
    private _next;
    constructor(module: Module, routes: RouteOptions);
    route(keys: string[]): Promise<any>;
    private leave;
    private enter;
    private doRoute;
    private initRoutes;
    private createHandler;
    private createActionHandler;
    private createModuleHandler;
}
export {};
