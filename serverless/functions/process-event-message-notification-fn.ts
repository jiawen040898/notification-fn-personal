import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const processEventMessageNotification: AwsFunctionHandler = {
    name: 'notification-processEventMessageNotification-fn',
    description: `Process Event Notification (v${version})`,
    handler: 'src/functions/process-event-message-notification.handler',
    // reservedConcurrency: 25,
    environment: {
        NOTIFICATION_EMAIL_REQUEST_QUEUE_URL:
            '${ssm:/configs/api/AWS_SQS_BASE_DNS}notification-email-request-queue',
        PUSH_NOTIFICATION_REQUEST_QUEUE_URL:
            '${ssm:/configs/api/AWS_SQS_BASE_DNS}notification-push-notification-queue',
    },
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:notification-domain-queue.fifo',
                batchSize: 1,
            },
        },
    ],
    layers,
    tags,
};
