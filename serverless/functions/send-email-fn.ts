import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const sendEmail: AwsFunctionHandler = {
    name: 'notification-sendEmail-fn',
    description: `Send Email via SES by process Email Request from SQS (v${version})`,
    handler: 'src/functions/send-email.handler',
    // reservedConcurrency: 25,
    environment: {
        SES_REGION: 'us-west-2',
    },
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:notification-email-request-queue',
                batchSize: 1,
            },
        },
    ],
    layers,
    tags,
};
