import { Node as MNode } from './node';
import { Appendable } from './template';
import { DataContext, Context } from './context';
export declare abstract class AnchorNode extends MNode {
    newParent: Appendable;
    anchor: Node;
    constructor(id?: string);
    render(context: DataContext): void;
    destroy(context: Context): void;
}
