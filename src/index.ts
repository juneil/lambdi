import 'reflect-metadata';
export * from './decorators';

import { Type, OnHandler } from './interfaces';
import { DependencyInjection } from './di';
import { AWSProviders } from './aws';
import { extractMetadataByDecorator } from './metadata';
import { Lambda } from './decorators';

/**
 * Generate the Lambda Handler
 * to be exported and used by AWS Lambda
 *
 * @param token Lambda Class
 * @param providers Provider list for the DI
 * @param options
 */
export function generateHandler<R, E, C>(
    token: Type<OnHandler<R, E, C>>
): (event: E, context: C) => R {
    return (event: E, context: C) => {
        const metadata = extractMetadataByDecorator<Lambda>(token, 'Lambda');
        const di = DependencyInjection.createAndResolve(
            [].concat(metadata.providers, AWSProviders(metadata)).filter(Boolean)
        );
        const instance = DependencyInjection.instantiate(token, di);
        return Reflect.apply(instance.onHandler, instance, [event, context]);
    };
}
