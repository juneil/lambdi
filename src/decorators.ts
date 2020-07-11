import { TypeDecorator, makeDecorator, Inject, InjectionToken, Optional } from 'injection-js';
import { Provider, Type } from './interfaces';

export { Inject, Optional, InjectionToken };

/**
 * Decorator signature
 */
export interface CoreDecorator<T> {
    (obj?: T): TypeDecorator;
    new (obj?: T): T;
}

/**
 * Create a decorator with metadata
 *
 * @param  {string} name
 * @param  {{[name:string]:any;}} props?
 * @returns CoreDecorator
 */
function createDecorator<T>(name: string, props?: { [name: string]: any }): CoreDecorator<T> {
    return <CoreDecorator<T>>makeDecorator(name, props);
}

/**
 * Lambda decorator.
 *
 * @Annotation
 */
export interface Lambda {
    providers?: (Type<any> | Provider)[];
}

export const Lambda = createDecorator<Lambda>('Lambda', {
    providers: undefined
});

/**
 * Service decorator.
 *
 * @Annotation
 */
export const Service = makeDecorator('Service', null);
