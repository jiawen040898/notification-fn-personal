import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { accountId } from '../../variables';

const customSecretPermissions = new PolicyStatement({
    actions: [
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
        'secretsmanager:PutSecretValue',
        'secretsmanager:CreateSecret',
        'secretsmanager:DeleteSecret',
        'secretsmanager:UpdateSecret',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:secretsmanager:*:${accountId}:secret:events!connection/*`,
    ],
    sid: 'CustomSecretPermissions',
});

const snsPermissions = new PolicyStatement({
    actions: ['sns:GetEndpointAttributes', 'sns:GetSubscriptionAttributes'],
    effect: Effect.ALLOW,
    resources: ['*'],
    sid: 'SNSPermissions',
});

const sesPermissions = new PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendBulkEmail'],
    effect: Effect.ALLOW,
    resources: ['*'],
    sid: 'SESPermissions',
});

const secretManagerPermissions = new PolicyStatement({
    actions: ['secretsmanager:DescribeSecret', 'secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:secretsmanager:*:${accountId}:secret:notification-postgresql-credential*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:redis-credentials*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:pusher-credentials*`,
    ],
    sid: 'SecretManagerPermissions',
});

const parameterStorePermissions = new PolicyStatement({
    actions: [
        'ssm:GetParametersByPath',
        'ssm:GetParameters',
        'ssm:GetParameter',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:ssm:*:${accountId}:parameter/configs/*`,
        `arn:aws:ssm:*:${accountId}:parameter/notification-fn/*`,
    ],
    sid: 'ParameterStorePermissions',
});

const snsCustomPermissions = new PolicyStatement({
    actions: ['sns:ListTagsForResource', 'sns:GetTopicAttributes'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:sns:us-west-2:${accountId}:ses-email-bounce`,
        `arn:aws:sns:us-west-2:${accountId}:ses-tracking-topic`,
    ],
    sid: 'SNSCustomPermissions',
});

const sqsPermissions = new PolicyStatement({
    actions: [
        'sqs:DeleteMessage',
        'sqs:GetQueueUrl',
        'sqs:ReceiveMessage',
        'sqs:SendMessage',
        'sqs:GetQueueAttributes',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:sqs:*:${accountId}:notification-domain-queue.fifo`,
        `arn:aws:sqs:*:${accountId}:notification-email-request-queue`,
        `arn:aws:sqs:*:${accountId}:notification-push-notification-queue`,
    ],
    sid: 'SQSPermissions',
});

export const notificationLambdaPolicy = [
    customSecretPermissions,
    snsPermissions,
    sesPermissions,
    secretManagerPermissions,
    parameterStorePermissions,
    snsCustomPermissions,
    sqsPermissions,
];
