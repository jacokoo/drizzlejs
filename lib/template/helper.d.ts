import { HelperResult } from './template';
import { AttributeValue } from './template';
import { DataContext } from './context';
export declare abstract class Helper {
    name: string;
    args: AttributeValue[];
    current: any;
    constructor(...args: AttributeValue[]);
    render(context: DataContext): HelperResult;
    arg(idx: number, context: DataContext): any;
    check(): void;
    assertCount(...numbers: number[]): void;
    assertDynamic(...numbers: number[]): void;
    abstract doRender(context: DataContext): any;
    private renderIt;
}
export declare class DelayHelper extends Helper {
    constructor(name: string, ...args: AttributeValue[]);
    doRender(context: DataContext): any;
}
export declare class EchoHelper extends Helper {
    doRender(context: any): any;
}
export declare class ConcatHelper extends Helper {
    doRender(context: any): string;
}
export declare class IfHelper extends Helper {
    name: string;
    check(): void;
    doRender(context: DataContext): any;
    use(context: DataContext): number;
    useSingle(context: any): number;
    useMultiple(context: any): number;
}
export declare class UnlessHelper extends IfHelper {
    name: string;
    use(context: DataContext): number;
}
