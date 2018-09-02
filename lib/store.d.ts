import { ModelOptions, Model } from './model';
import { Module } from './module';
export interface StoreOptions {
    models?: {
        [key: string]: ModelOptions;
    };
    actions?: {
        [key: string]: (payload: any) => void;
    };
}
export declare class Store {
    private _options;
    private _models;
    private _names;
    private _module;
    constructor(mod: Module, options: StoreOptions, updateKey: string);
    fire(name: string, data: any): void;
    readonly models: {
        [key: string]: Model;
    };
    get(name?: string): any;
    set(data: object): void;
    dispatch(name: string, payload: any): Promise<void>;
}
