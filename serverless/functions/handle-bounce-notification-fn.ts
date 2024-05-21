import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const handleBounceNotification: AwsFunctionHandler = {
    name: 'notification-handleBounceNotification-fn',
    description: `Update Email Activity Message Bounce Status by process SES Notification from SNS (v${version})`,
    handler: 'src/functions/handle-bounce-notification.handler',
    // reservedConcurrency: 25,
    events: [
        {
            sns: {
                arn: 'arn:aws:sns:us-west-2:${aws:accountId}:ses-email-bounce',
            },
        },
    ],
    layers,
    tags,
};
