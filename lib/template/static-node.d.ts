import { Node } from './node';
import { DataContext, Context } from './context';
export declare class StaticNode extends Node {
    name: string;
    attributes: [string, any][];
    constructor(name: string, id?: string);
    attribute(name: string, value: any): void;
    render(context: DataContext): void;
    update(context: DataContext): void;
    destroy(context: Context): void;
    create(): HTMLElement | SVGElement;
}
