import { Node } from './node';
import { AnchorNode } from './anchor-node';
import { DataContext, Context } from './context';
export declare class EachBlock extends AnchorNode {
    args: string[];
    trueNode: () => Node;
    falseNode?: Node;
    currentSize: number;
    nodes: Node[];
    constructor(args: string[], trueNode: () => Node, falseNode?: Node);
    init(): void;
    isEmpty(list: any): boolean;
    sub(context: DataContext, i: number | string): DataContext;
    render(context: DataContext): void;
    createTrueNode(i: number, context: DataContext): void;
    renderKeyValue(arr: [number | string, any][], context: DataContext): void;
    renderElse(context: DataContext): void;
    update(context: DataContext): void;
    updateElse(context: DataContext): void;
    updateKeyValue(arr: [any, any][], context: DataContext): void;
    destroy(context: Context): void;
}
