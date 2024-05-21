import {
    CompositePrincipal,
    type IRole,
    ManagedPolicy,
    ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { BaseIAM } from '../../base';
import { accountId } from '../../variables';
import { notificationLambdaPolicy } from './notification-lambda-policy';

export class IAMRoleGroupResources extends Construct {
    public readonly notificationLambdaRole: IRole;

    /**
     * IAMRoleGroupResources
     *
     * @public notificationLambdaRole {@link IRole}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.notificationLambdaRole = new BaseIAM(
            this,
            'notification-lambda-role',
            {
                resourceName: 'notification-lambda',
                assumedBy: new CompositePrincipal(
                    new ServicePrincipal('lambda.amazonaws.com'),
                ),
                customPolicies: [
                    {
                        policyName: 'notification-lambda',
                        statements: notificationLambdaPolicy,
                    },
                ],
                managedPolicies: [
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'pulsifi-kms-policy',
                        `arn:aws:iam::${accountId}:policy/PulsifiKMSPolicy`,
                    ),
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'aws-lambda-vpc-access-execution-role',
                        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
                    ),
                ],
            },
        ).role;
    }
}
