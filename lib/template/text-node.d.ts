import { Helper } from './helper';
import { Node } from './node';
import { DataContext, Context } from './context';
export declare class TextNode extends Node {
    nodes: Node[];
    constructor(...args: (string | Helper)[]);
    init(context: Context): void;
    render(context: DataContext): void;
    update(context: DataContext): void;
    destroy(context: Context): void;
    clearHelper(): void;
}
