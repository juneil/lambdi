import {
    ReflectiveInjector,
    ResolvedReflectiveFactory,
    ResolvedReflectiveProvider,
    Type
} from 'injection-js';
import { ReflectiveDependency } from 'injection-js/reflective_provider';
import { Provider } from './interfaces';

export class DependencyInjection {
    /**
     * Create a new DI and
     * can inherits from a parent DI
     *
     * @param  {Type<T>[]} providers
     * @param  {ReflectiveInjector} parent?
     * @returns Observable<ReflectiveInjector>
     */
    static createAndResolve(
        providers: Array<Type<any> | Provider>,
        parent?: ReflectiveInjector
    ): ReflectiveInjector {
        const p = [].concat(providers).filter(Boolean);
        return !!parent ? parent.resolveAndCreateChild(p) : ReflectiveInjector.resolveAndCreate(p);
    }

    /**
     * Instantiate a component
     * resolving its dependencies
     * without inject the component
     * into the DI
     *
     * @param  {Type<T>} component
     * @param  {ReflectiveInjector} di
     * @returns T
     */
    static instantiate<T>(component: Type<T>, di: ReflectiveInjector): T {
        const deps = ReflectiveInjector.resolve([component])
            .map((items) => items.resolvedFactories)
            .map((items: ResolvedReflectiveFactory[]) =>
                items.reduce((a, x: ResolvedReflectiveFactory) => a.concat(x.dependencies), [])
            )
            .map((items) => items.filter(Boolean))
            .map((items: ReflectiveDependency[]) =>
                items.map((item) => (di as any)['_getByReflectiveDependency'](item))
            )
            .reduce((a, item) => a.concat(item), []);

        return Reflect.construct(component, deps);
    }
}
