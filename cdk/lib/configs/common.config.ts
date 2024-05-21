import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

import { CommonCDKEnvironmentVariables } from '../interfaces';
import { environment, region } from '../variables';

export const commonEnvironmentVariables = (
    scope: Construct,
): CommonCDKEnvironmentVariables => ({
    NODE_ENV: environment,
    SENTRY_DSN:
        'https://d6994d3b0e374c8a83ef95055069d63b@o157451.ingest.sentry.io/6531328',
    SERVERLESS_STAGE: environment,
    SM_NAME: 'notification-postgresql-credential',
    REDIS_SM_NAME: 'redis-credentials',
    REGION: region,
    EMPLOYEE_APP_URL: StringParameter.valueForStringParameter(
        scope,
        '/configs/PULSIFI_EMPLOYEE_APP_URL',
    ),
    AWS_ALB_DNS: StringParameter.valueForStringParameter(
        scope,
        '/configs/AWS_ALB_BASE_DNS',
    ),
    SENDER_EMAIL: StringParameter.valueForStringParameter(
        scope,
        '/configs/PULSIFI_SENDER_EMAIL',
    ),
});
