import { custom } from './custom';
import { functions } from './functions';
import { plugins } from './plugins';

export const main = {
    service: 'notification-fn',
    frameworkVersion: '3',
    useDotenv: true,
    configValidationMode: 'warn',
    package: {
        individually: true,
    },
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        versionFunctions: false,
        stackName: 'notification-fn-${opt:stage}-stack',
        region: '${opt:region}',
        memorySize: 256,
        timeout: 30,
        logRetentionInDays: '${ssm:/configs/LOG_RETENTION_IN_DAYS}',
        iam: {
            role: 'arn:aws:iam::${aws:accountId}:role/notification-lambda-role',
        },
        vpc: {
            securityGroupIds: [
                '${ssm:/notification-fn/VPC_SECURITY_GROUP_IDS}',
            ],
            subnetIds: '${ssm:/configs/VPC_PRIVATE_SUBNET_IDS}',
        },
        stackTags: {
            Environment: '${opt:stage}',
            Owner: 'dev-team@pulsifi.me',
            Version: '${env:TAG_VERSION}',
        },
        environment: {
            NODE_ENV: '${opt:stage}',
            SENTRY_DSN:
                'https://c2f0f35605994032b1df6df1bf130cd7@o157451.ingest.sentry.io/5999584',
            SERVERLESS_STAGE: '${opt:stage}',
            SM_NAME: 'notification-postgresql-credential',
            REDIS_SM_NAME: 'redis-credentials',
            REGION: '${aws:region}',
            EMPLOYEE_APP_URL: '${ssm:/configs/PULSIFI_EMPLOYEE_APP_URL}',
            AWS_ALB_DNS: '${ssm:/configs/api/AWS_ALB_BASE_DNS}',
            SENDER_EMAIL: '${ssm:/configs/PULSIFI_SENDER_EMAIL}',
        },
        deploymentBucket: {
            blockPublicAccess: true,
            name: 'notification-fn-${opt:stage}-${opt:region}-stack-bucket-1',
            maxPreviousDeploymentArtifacts: 5,
            serverSideEncryption: 'AES256',
        },
    },
    resources: {
        extensions: {
            SendEmailLogGroup: {
                DeletionPolicy: 'Retain',
            },
            SendPushNotificationLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ProcessEventMessageNotificationLogGroup: {
                DeletionPolicy: 'Retain',
            },
            HandleBounceNotificationLogGroup: {
                DeletionPolicy: 'Retain',
            },
            HandleNotificationMetricLogGroup: {
                DeletionPolicy: 'Retain',
            },
        },
    },
    plugins,
    custom,
    functions,
};

export default main;
