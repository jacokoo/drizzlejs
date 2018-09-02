import { Application } from './application';
import { Module } from './module';
export declare class Loader {
    protected _app: Application;
    protected _path: string;
    protected _args: any;
    constructor(app: Application, path: string, args: any);
    load(file: any, mod: Module): Promise<object>;
}
