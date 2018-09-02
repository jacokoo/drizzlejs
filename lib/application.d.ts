import { Loader } from './loader';
import { Disposable } from './drizzle';
import { ModuleOptions } from './module';
interface ApplicationOptions {
    stages?: string[];
    scriptRoot?: string;
    container: HTMLElement;
    entry: string | ModuleOptions;
    customEvents?: {
        [name: string]: (HTMLElement: any, callback: (any: any) => void) => Disposable;
    };
    getResource?(path: any): Promise<object>;
}
interface LoaderConstructor {
    new (app: Application, path: string, args?: any): Loader;
}
export declare class Application {
    options: ApplicationOptions;
    loaders: {
        [name: string]: LoaderConstructor;
    };
    constructor(options: ApplicationOptions);
    registerLoader(loader: LoaderConstructor, name?: string): void;
    createLoader(path: string, loader?: {
        name: string;
        args?: any;
    }): Loader;
    start(): Promise<any>;
    private startViewport;
    private startRouter;
}
export {};
