import { Node } from './node';
import { Renderable } from '../renderable';
import { Context, DataContext } from './context';
export declare class RegionNode extends Node {
    nodes: Node[];
    item: Renderable<any>;
    context: DataContext;
    constructor(id?: string);
    init(context: Context): void;
    render(context: DataContext): void;
    update(context: DataContext): void;
    destroy(context: Context): void;
    showNode(nodes: Node[], context: DataContext): Promise<any>;
    show(name: string, state: object): Promise<import("../../../../../../../Users/guyong/ws/fun/drizzlejs/src/view").View | import("../../../../../../../Users/guyong/ws/fun/drizzlejs/src/module").Module>;
    close(): Promise<any>;
}
