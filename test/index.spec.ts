import { Lambda, generateHandler, Service } from '../src';
import { OnHandler } from '../src/interfaces';
import { extractMetadataByDecorator } from '../src/metadata';

describe('Unit tests', () => {
    test('Lambda without options', () => {
        @Lambda()
        class MyLambda implements OnHandler<any, any> {
            onHandler() {
                throw new Error('Method not implemented.');
            }
        }

        const metadata = extractMetadataByDecorator<Lambda>(MyLambda, 'Lambda');

        expect(metadata).toMatchObject({});
    });

    test('Lambda with options', () => {
        @Lambda({})
        class MyLambda implements OnHandler<any, any> {
            onHandler() {
                throw new Error('Method not implemented.');
            }
        }

        const metadata = extractMetadataByDecorator<Lambda>(MyLambda, 'Lambda');

        expect(metadata).toMatchObject({});
    });

    test('Lambda Handler call', () => {
        @Lambda()
        class MyLambda implements OnHandler<any, string> {
            onHandler() {
                return 'ok';
            }
        }

        expect(generateHandler(MyLambda)(null, null)).toBe('ok');
    });

    test('DI with 1 dep', () => {
        @Service()
        class MyService {
            hello() {
                return 'hello';
            }
        }

        @Lambda({
            providers: [MyService]
        })
        class MyLambda implements OnHandler<any, string> {
            constructor(private srv: MyService) {}
            onHandler() {
                return this.srv.hello();
            }
        }

        expect(generateHandler(MyLambda)(null, null)).toBe('hello');
    });

    test('DI with 2 deps', () => {
        @Service()
        class MyService1 {
            hello() {
                return 'hello';
            }
        }

        @Service()
        class MyService2 {
            world() {
                return 'world';
            }
        }

        @Lambda({
            providers: [MyService1, MyService2]
        })
        class MyLambda implements OnHandler<any, string> {
            constructor(private srv1: MyService1, private srv2: MyService2) {}
            onHandler() {
                return `${this.srv1.hello()} ${this.srv2.world()}`;
            }
        }

        expect(generateHandler(MyLambda)(null, null)).toBe('hello world');
    });

    test('DI with 2 deps nested', () => {
        @Service()
        class MyService2 {
            world() {
                return 'world';
            }
        }

        @Service()
        class MyService1 {
            constructor(private srv: MyService2) {}
            hello() {
                return `hello ${this.srv.world()}`;
            }
        }

        @Lambda({
            providers: [MyService1, MyService2]
        })
        class MyLambda implements OnHandler<any, string> {
            constructor(private srv1: MyService1) {}
            onHandler() {
                return this.srv1.hello();
            }
        }

        expect(generateHandler(MyLambda)(null, null)).toBe('hello world');
    });
});
