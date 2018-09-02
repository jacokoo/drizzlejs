import { Node } from './node';
import { AttributeValue } from './template';
import { AnchorNode } from './anchor-node';
import { Context, DataContext } from './context';
export declare const Compare: {
    [key: string]: (v1: any, v2: any) => boolean;
};
export declare class IfBlock extends AnchorNode {
    args: AttributeValue[];
    trueNode: Node;
    falseNode?: Node;
    current: Node;
    constructor(args: AttributeValue[], trueNode: Node, falseNode?: Node);
    init(context: Context): void;
    use(context: DataContext): boolean;
    useCompare(context: DataContext): boolean;
    useSingle(context: DataContext): boolean;
    render(context: DataContext): void;
    update(context: DataContext): void;
    destroy(context: Context): void;
}
export declare class UnlessBlock extends IfBlock {
    use(context: any): boolean;
}
