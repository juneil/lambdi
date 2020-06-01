# LambDI

Lambda with Typescript and DI

## Example:

```typescript
class MyService {
    foo() {
        return 'hello world!';
    }
}

@Lambda({
    providers: [MyService]
})
class MyLambda implements OnHandler<APIGatewayProxyEvent, APIGatewayProxyResult> {
    constructor(private service: MyService) {}

    onHandler(event) {
        return {
            statusCode: 200,
            body: this.service.foo()
        };
    }
}

export const handler = generateHandler(MyLambda);
```

## Lambda Decorator

`@Lambda({ ...options })`

Allows a class to resolve and inject dependencies.
Entrypoint for the Lambda and must inplements OnHandler.

Options:

-   `providers` - list of class or provider
-   `localstack` - if true, will set the endpoint for aws services to a LocalStack instance

Example:

```typescript
@Lambda({
    providers: [Service],
    localstack: true
})
class MyLambda implements OnHandler<Event, Result> { ... }
```

## Service Decorator

`@Service()`

Allows a class to resolve and inject dependencies.
Must be provided as provider of the `@Lambda` if used.

Example:

```typescript
class MyService {
    foo() {
        return 1;
    }
}

@Service()
class MyServiceWithDep {
    constructor(private svc: MyService) {}

    foobar() {
        return this.svc.foo() + 1;
    }
}

@Lambda({
    providers: [MyService, MyServiceWithDep]
})
class MyLambda implements OnHandler<any, number> {
    constructor(private svc: MyServiceWithDep) {}

    onHandler() {
        return this.svc.foobar();
    }
}
```

## AWS Services

AWS Services are automatically injected:

```typescript
...
constructor(
    private s3: AWS.S3,
    private sqs: AWS.SQS,
    private sns: AWS.SNS,
    private db: AWS.DynamoDB.DocumentClient
) {
    this.db.PutItem(...);
    this.s3.GetObject(...);
    ...
}
...
```
