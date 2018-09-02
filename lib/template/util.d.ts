import { AttributeValue, Attribute, Appendable } from './template';
import { DataContext } from './context';
export declare function tokenize(input: string): string[];
export declare function getValue(key: string, context: DataContext): any;
export declare function getAttributeValue(attr: AttributeValue, context: DataContext): any;
export declare function resolveEventArgument(me: any, context: DataContext, args: Attribute[], event: any): any[];
export declare function createAppendable(target: Node): Appendable;
