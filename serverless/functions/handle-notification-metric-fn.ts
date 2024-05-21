import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const handleNotificationMetric: AwsFunctionHandler = {
    name: 'notification-handleNotificationMetric-fn',
    description: `Update Email Activity Message Metrics (Open/Click) by process SES Notification from SNS (v${version})`,
    handler: 'src/functions/handle-notification-metric.handler',
    // reservedConcurrency: 25,
    // events: [
    //     {
    //         sns: {
    //             arn: 'arn:aws:sns:us-west-2:${aws:accountId}:ses-tracking-topic',
    //         },
    //     },
    // ],
    layers,
    tags,
};
