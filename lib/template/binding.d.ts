import { Updatable } from './template';
import { DynamicNode } from './dynamic-node';
import { DataContext } from './context';
export declare const updateContext: (context: DataContext, to: string, value: any) => void;
export declare const bind: (node: DynamicNode, context: DataContext, from: string, to: string) => Updatable;
