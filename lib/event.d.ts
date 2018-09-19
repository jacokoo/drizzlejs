import { Disposable } from './drizzle';
declare type Handler = (data: any) => void;
export declare class Events {
    _handlers: {
        [name: string]: Handler[];
    };
    on(name: string, handler: (data: any) => void): Disposable;
    fire(name: string, data: any): void;
}
export {};
