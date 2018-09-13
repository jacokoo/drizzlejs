import { Application } from './application';
export interface Lifecycle {
    stage?: string;
    init?(): any;
    collect?(data: object): object;
    beforeRender?(): any;
    rendered?(data: object): any;
    beforeUpdate?(): any;
    updated?(data: object): any;
    beforeDestroy?(): any;
    destroyed?(): any;
}
export declare class LifecycleContainer {
    app: Application;
    private _cycles;
    constructor(app: Application, options: {
        cycles?: Lifecycle[];
    } & Lifecycle, ...args: Lifecycle[]);
    protected _doInit(): Promise<any>;
    protected _doCollect(data: object): object;
    protected _doBeforeRender(): Promise<any>;
    protected _doRendered(data: object): Promise<any>;
    protected _doBeforeUpdate(): Promise<any>;
    protected _doUpdated(data: object): Promise<any>;
    protected _doBeforeDestroy(): Promise<any>;
    protected _doDestroyed(): Promise<any>;
}
