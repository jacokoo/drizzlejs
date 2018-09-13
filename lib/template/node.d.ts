import { Appendable } from './template';
import { Context, DataContext } from './context';
export declare abstract class Node {
    id: string;
    element: HTMLElement;
    parent: Appendable;
    children: Node[];
    rendered: boolean;
    inSvg: boolean;
    constructor(id?: string);
    init(context: Context): void;
    render(context: DataContext): void;
    update(context: DataContext): void;
    destroy(context: Context): void;
    setChildren(children: Node[]): void;
    setToSvg(): void;
    create(): any;
}
