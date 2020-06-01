import AWS from 'aws-sdk';
import { Lambda } from './decorators';
import { Provider } from './interfaces';

function getServicePort(service: string): string {
    switch (service) {
        case 's3':
            return '4572';
        case 'dynamodb':
            return '4569';
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
            provide: AWS.DynamoDB.DocumentClient,
            useFactory: () => new AWS.DynamoDB.DocumentClient(params('dynamodb', lambda)),
            deps: []
        },
        {
            provide: AWS.S3,
            useFactory: () => new AWS.S3(params('s3', lambda)),
            deps: []
        }
    ] as Provider[];
