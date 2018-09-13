import { Module } from './module';
import { DrizzlePlugin } from './drizzle';
interface ActionHandler {
    action: string;
}
interface ModuleHandler {
    ref: string;
    region?: string;
    model?: string;
}
declare type Handler = DefaultHandler | ActionHandler | ModuleHandler | string;
interface RouteOptions {
    [route: string]: Handler;
}
declare module './module' {
    interface Module {
        _router?: Router;
    }
    interface ModuleOptions {
        routes?: RouteOptions;
    }
}
interface DefaultHandler {
    enter(args: object): Promise<Router>;
    update?(args: object): Promise<any>;
    leave?(): Promise<any>;
}
declare class Router {
    _prefix: string;
    private _module;
    private _keys;
    private _defs;
    private _currentKey;
    private _next;
    constructor(module: Module, routes: RouteOptions, prefix?: string);
    route(keys: string[]): Promise<any>;
    private leave;
    private enter;
    private doRoute;
    private initRoutes;
    private createHandler;
    private createActionHandler;
    private createModuleHandler;
}
export declare const RouterPlugin: DrizzlePlugin;
export {};
