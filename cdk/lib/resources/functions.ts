import type { Function as AwsLambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { BaseFunction } from '../base';
import type {
    NotificationProcessEventMessageNotificationFnConfig,
    NotificationPushNotificationFnConfig,
    NotificationSendEmailFnConfig,
} from '../interfaces';
import { accountId, version } from '../variables';
import type { IAMRoleGroupResources } from './iam/iam-roles';
import type { LayerGroupResources } from './layers';
import type SQSGroupResources from './sqs';

/**
 * FunctionGroupResourcesProps
 *
 * @param iamRoleGroupResources {@link IAMRoleGroupResources}
 * @param sqsGroupResources {@link SQSGroupResources}
 * @param layerGroupResources {@link LayerGroupResources}
 */
type FunctionGroupResourcesProps = {
    iamRoleGroupResources: IAMRoleGroupResources;
    sqsGroupResources: SQSGroupResources;
    layerGroupResources: LayerGroupResources;
};

export class FunctionGroupResources extends Construct {
    public readonly notificationHandleBounceNotificationFn: AwsLambdaFunction;
    public readonly notificationHandleNotificationMetricFn: AwsLambdaFunction;
    public readonly notificationProcessEventMessageNotificationFn: AwsLambdaFunction;
    public readonly notificationSendEmailFn: AwsLambdaFunction;
    public readonly notificationPushNotificationFn: AwsLambdaFunction;

    /**
     * FunctionGroupResources
     *
     * @public notificationHandleBounceNotificationFn {@link AwsLambdaFunction}
     * @public notificationHandleNotificationMetricFn {@link AwsLambdaFunction}
     * @public notificationProcessEventMessageNotificationFn {@link AwsLambdaFunction}
     * @public notificationSendEmailFn {@link AwsLambdaFunction}
     * @public notificationPushNotificationFn {@link AwsLambdaFunction}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link FunctionGroupResourcesProps}
     */
    constructor(
        scope: Construct,
        id: string,
        props: FunctionGroupResourcesProps,
    ) {
        super(scope, id);

        this.notificationHandleBounceNotificationFn = new BaseFunction(
            this,
            'notification-handleBounceNotification-fn',
            {
                functionName: 'notification-handleBounceNotification-fn',
                description: `Update Email Activity Message Bounce Status by process SES Notification from SNS (v${version})`,
                entry: 'src/functions/handle-bounce-notification.ts',
                // reservedConcurrentExecutions: 25,
                isLogGroupExists: true,
                iamRole: props.iamRoleGroupResources.notificationLambdaRole,
                layers: [props.layerGroupResources.notificationFnLayer],
                snsEventSources: [
                    {
                        topic: Topic.fromTopicArn(
                            this,
                            'ses-email-bounce',
                            `arn:aws:sns:us-west-2:${accountId}:ses-email-bounce`,
                        ),
                    },
                ],
            },
        ).lambda;

        this.notificationHandleNotificationMetricFn = new BaseFunction(
            this,
            'notification-handleNotificationMetric-fn',
            {
                functionName: 'notification-handleNotificationMetric-fn',
                description: `Update Email Activity Message Metrics (Open/Click) by process SES Notification from SNS (v${version})`,
                entry: 'src/functions/handle-notification-metric.ts',
                // reservedConcurrentExecutions: 25,
                isLogGroupExists: true,
                iamRole: props.iamRoleGroupResources.notificationLambdaRole,
                layers: [props.layerGroupResources.notificationFnLayer],
            },
        ).lambda;

        this.notificationProcessEventMessageNotificationFn =
            new BaseFunction<NotificationProcessEventMessageNotificationFnConfig>(
                this,
                'notification-processEventMessageNotification-fn',
                {
                    functionName:
                        'notification-processEventMessageNotification-fn',
                    description: `Process Event Notification (v${version})`,
                    entry: 'src/functions/process-event-message-notification.ts',
                    // reservedConcurrentExecutions: 25,
                    isLogGroupExists: true,
                    lambdaSpecificEnvironmentVariables: {
                        NOTIFICATION_EMAIL_REQUEST_QUEUE_URL: `${StringParameter.valueForStringParameter(
                            scope,
                            '/configs/api/AWS_SQS_BASE_DNS',
                        )}notification-email-request-queue`,
                        PUSH_NOTIFICATION_REQUEST_QUEUE_URL: `${StringParameter.valueForStringParameter(
                            scope,
                            '/configs/api/AWS_SQS_BASE_DNS',
                        )}notification-push-notification-queue`,
                    },
                    iamRole: props.iamRoleGroupResources.notificationLambdaRole,
                    layers: [props.layerGroupResources.notificationFnLayer],
                    sqsEventSources: [
                        {
                            queue: props.sqsGroupResources
                                .notificationDomainQueue,
                            sqsEventSourceProps: { batchSize: 1 },
                        },
                    ],
                },
            ).lambda;

        this.notificationSendEmailFn =
            new BaseFunction<NotificationSendEmailFnConfig>(
                this,
                'notification-sendEmail-fn',
                {
                    functionName: 'notification-sendEmail-fn',
                    description: `Send Email via SES by process Email Request from SQS (v${version})`,
                    entry: 'src/functions/send-email.ts',
                    // reservedConcurrentExecutions: 25,
                    isLogGroupExists: true,
                    lambdaSpecificEnvironmentVariables: {
                        SES_REGION: 'us-west-2',
                    },
                    iamRole: props.iamRoleGroupResources.notificationLambdaRole,
                    layers: [props.layerGroupResources.notificationFnLayer],
                    sqsEventSources: [
                        {
                            queue: props.sqsGroupResources
                                .notificationEmailRequestQueue,
                            sqsEventSourceProps: { batchSize: 1 },
                        },
                    ],
                },
            ).lambda;

        this.notificationPushNotificationFn =
            new BaseFunction<NotificationPushNotificationFnConfig>(
                this,
                'notification-push-notification-fn',
                {
                    functionName: 'notification-push-notification-fn',
                    description: `Send push notification via Pusher from SQS (v${version})`,
                    entry: 'src/functions/send-push-notification.ts',
                    // reservedConcurrentExecutions: 25,
                    isLogGroupExists: true,
                    lambdaSpecificEnvironmentVariables: {
                        PUSHER_SM_NAME: 'pusher-credentials',
                    },
                    iamRole: props.iamRoleGroupResources.notificationLambdaRole,
                    layers: [props.layerGroupResources.notificationFnLayer],
                    sqsEventSources: [
                        {
                            queue: props.sqsGroupResources
                                .notificationPushNotificationQueue,
                            sqsEventSourceProps: { batchSize: 1 },
                        },
                    ],
                },
            ).lambda;
    }
}
