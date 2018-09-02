import { NormalValue } from './template';
import { DataContext } from './context';
export declare class Transformer {
    value: string;
    end: NormalValue;
    items: TransformerItem[];
    constructor(value: string, items: TransformerItem[], end?: NormalValue);
    render(context: DataContext): any;
}
export declare class TransformerItem {
    name: string;
    args: NormalValue[];
    constructor(name: string, args: NormalValue[]);
    render(context: DataContext, v: any): any;
}
