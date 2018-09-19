import { DynamicNode } from './dynamic-node';
import { Disposable } from '../drizzle';
export declare class WindowNode extends DynamicNode {
    constructor(id?: string);
    init(): void;
    dynamicAttribute(): void;
    component(): void;
    bind(from: string, to: string): void;
    bindEvent(el: EventTarget, name: string, cb: (event: any) => void): Disposable;
}
export declare class ApplicationNode extends DynamicNode {
    constructor(id?: string);
    init(): void;
    dynamicAttribute(): void;
    component(): void;
    bind(): void;
    bindEvent(el: EventTarget, name: string, cb: (event: any) => void): Disposable;
}
