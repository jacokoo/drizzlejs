import { Application } from './application';
export interface Lifecycle {
    stage?: string;
    init?(): any;
    beforeRender?(): any;
    rendered?(): any;
    beforeUpdate?(): any;
    updated?(): any;
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
    protected _doBeforeRender(): Promise<any>;
    protected _doRendered(): Promise<any>;
    protected _doBeforeUpdate(): Promise<any>;
    protected _doUpdated(): Promise<any>;
    protected _doBeforeDestroy(): Promise<any>;
    protected _doDestroyed(): Promise<any>;
}
