import { DynamoDB, S3, SQS, SNS } from 'aws-sdk';
import { Lambda } from './decorators';
import { Provider } from './interfaces';

import {
    Context,
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    S3Event,
    SNSEvent,
    SQSEvent
} from 'aws-lambda';

export { Context, APIGatewayProxyEvent, APIGatewayProxyResult, S3Event, SNSEvent, SQSEvent };

function getServicePort(service: string): string {
    switch (service) {
        case 's3':
            return '4572';
        case 'dynamodb':
            return '4569';
        case 'sqs':
            return '4576';
        case 'sns':
            return '4575';
    }
}

function params(service: string, lambda: Lambda) {
    return lambda.localstack && process.env.AWS_SAM_LOCAL
        ? { endpoint: `http://localstack:${getServicePort(service)}` }
        : {};
}

/**
 * Provide a list of AWS Services for the Lambda DI
 *
 * @param options
 */
export const AWSProviders = (lambda: Lambda = {}) =>
    [
        {
            provide: DynamoDB.DocumentClient,
            useFactory: () => new DynamoDB.DocumentClient(params('dynamodb', lambda)),
            deps: []
        },
        {
            provide: S3,
            useFactory: () => new S3(params('s3', lambda)),
            deps: []
        },
        {
            provide: SQS,
            useFactory: () => new SQS(params('sqs', lambda)),
            deps: []
        },
        {
            provide: SNS,
            useFactory: () => new SNS(params('sns', lambda)),
            deps: []
        }
    ] as Provider[];
