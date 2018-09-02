import { Helper, EchoHelper } from './template/helper';
import { IfBlock, UnlessBlock } from './template/if-block';
import { EachBlock } from './template/each-block';
import { Loader } from './loader';
import { customEvents, AttributeValue, ModuleTemplate, ViewTemplate, NormalValue, ValueType } from './template/template';
import { components, helpers } from './template/context';
import { Application } from './application';
import { StaticNode } from './template/static-node';
import { DynamicNode } from './template/dynamic-node';
import { TextNode } from './template/text-node';
import { ReferenceNode } from './template/reference-node';
import { RegionNode } from './template/region-node';
import { Node } from './template/node';
import { TransformerItem, Transformer } from './template/transformer';
export interface Disposable {
    dispose(): void;
}
declare const loaders: {
    default: typeof Loader;
};
export declare const lifecycles: {
    module: any[];
    view: any[];
};
export declare const factory: {
    SN: (name: string, id?: string) => StaticNode;
    DN: (name: string, id?: string) => DynamicNode;
    TX: (...ss: (string | Helper)[]) => TextNode;
    RG: (id?: string) => RegionNode;
    REF: (name: string, id?: string) => ReferenceNode;
    SV: (v: string) => NormalValue;
    DV: (v: string) => NormalValue;
    AT: (n: string, v: AttributeValue) => [string, AttributeValue];
    H: (n: string | [ValueType.STATIC, string | number | boolean] | [ValueType.DYNAMIC, string] | [ValueType.TRANSFORMER, Transformer]) => EchoHelper;
    HH: (n: string, ...args: AttributeValue[]) => any;
    EACH: (args: string[], trueNode: () => Node, falseNode?: Node) => EachBlock;
    IF: (args: AttributeValue[], trueNode: Node, falseNode?: Node) => IfBlock;
    UN: (n: string, trueNode: Node, falseNode?: Node) => UnlessBlock;
    C: (parent: Node, ...children: Node[]) => void;
    SA: (d: StaticNode | DynamicNode | ReferenceNode, name: string, value: any) => void;
    DA: (d: DynamicNode, name: string, ...hs: Helper[]) => void;
    BD: (d: DynamicNode, from: string, to: string) => void;
    EV: (d: DynamicNode | ReferenceNode, event: string, method: string, ...attrs: [string, AttributeValue][]) => void;
    AC: (d: DynamicNode | ReferenceNode, event: string, method: string, ...attrs: [string, AttributeValue][]) => void;
    CO: (d: DynamicNode, name: string, ...hs: Helper[]) => void;
    TI: (name: string, ...args: NormalValue[]) => TransformerItem;
    TV: (value: string, end?: NormalValue, ...items: TransformerItem[]) => AttributeValue;
    MP: (d: ReferenceNode, from: string, to?: string) => void;
};
export { helpers, loaders, customEvents, components, ModuleTemplate, ViewTemplate, Application, Loader, };
