import { Loader } from './loader';
import { ModuleOptions } from './module';
import { CustomEvent, CustomHelper, Component } from './template/context';
import { DrizzlePlugin } from './drizzle';
import { Lifecycle } from './lifecycle';
import { Events } from './event';
export interface ApplicationOptions {
    stages?: string[];
    scriptRoot?: string;
    container: HTMLElement;
    entry: string | ModuleOptions;
    customEvents?: {
        [name: string]: CustomEvent;
    };
    helpers?: {
        [name: string]: CustomHelper;
    };
    components?: {
        [name: string]: Component;
    };
    moduleLifecycles?: Lifecycle[];
    viewLifecycles?: Lifecycle[];
    getResource?(path: any): Promise<object>;
}
interface LoaderConstructor {
    new (app: Application, path: string, args?: any): Loader;
}
export declare class Application extends Events {
    options: ApplicationOptions;
    loaders: {
        [name: string]: LoaderConstructor;
    };
    private _plugins;
    constructor(options: ApplicationOptions);
    registerLoader(loader: LoaderConstructor, name?: string): void;
    createLoader(path: string, loader?: {
        name: string;
        args?: any;
    }): Loader;
    use(plugin: DrizzlePlugin): void;
    start(): Promise<any>;
    private startViewport;
}
export {};
