export interface ModelOptions {
    url?: string;
    root?: string;
    data: () => any;
    parser?: (data: any) => any;
}
export declare class Model {
    private _options;
    private _data;
    constructor(options: ModelOptions);
    set(data: any): void;
    get(): any;
}
