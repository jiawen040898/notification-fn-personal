import type { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

import { BaseSQS } from '../base';
import { accountId, region } from '../variables';

export default class SQSGroupResources extends Construct {
    public readonly notificationDomainQueue: Queue;
    public readonly notificationEmailRequestQueue: Queue;
    public readonly notificationPushNotificationQueue: Queue;

    /**
     * SQSGroupResources
     *
     * @public notificationDomainQueue {@link Queue}
     * @public notificationEmailRequestQueue {@link Queue}
     * @public notificationPushNotificationQueue {@link Queue}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.notificationDomainQueue = new BaseSQS(
            this,
            'notification-domain-queue',
            {
                sqsName: 'notification-domain',
                fifo: true,
                isDlq: false,
                snsSubscriptions: [
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:talent-management-domain-topic.fifo`,
                    },
                ],
            },
        ).mainSQS;

        this.notificationEmailRequestQueue = new BaseSQS(
            this,
            'notification-email-request-queue',
            {
                sqsName: 'notification-email-request',
                fifo: false,
                isDlq: false,
            },
        ).mainSQS;

        this.notificationPushNotificationQueue = new BaseSQS(
            this,
            'notification-push-notification-queue',
            {
                sqsName: 'notification-push-notification',
                fifo: false,
                isDlq: false,
            },
        ).mainSQS;
    }
}
