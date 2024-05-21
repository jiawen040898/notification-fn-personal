import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const sendPushNotification: AwsFunctionHandler = {
    name: 'notification-push-notification-fn',
    description: `Send push notification via Pusher from SQS (v${version})`,
    handler: 'src/functions/send-push-notification.handler',
    // reservedConcurrency: 25,
    environment: {
        PUSHER_SM_NAME: 'pusher-credentials',
    },
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:notification-push-notification-queue',
                batchSize: 1,
            },
        },
    ],
    layers,
    tags,
};
