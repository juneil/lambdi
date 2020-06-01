/**
 * Class type
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

/**
 * Provider interface
 */
export interface Provider {
    provide: any;
    useClass?: any;
    useValue?: any;
    useExisting?: any;
    useFactory?: any;
    deps?: any[];
}

/**
 * Lambda Lifecycle Hook
 * Entrypoint
 *
 * @returns void | R
 */
export interface OnHandler<R, E, C> {
    onHandler(event: E, context: C): void | R;
}
