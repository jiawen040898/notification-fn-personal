import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import {
    CustomLambdaErrorAlarmConstruct,
    CustomLambdaLogGroupConstruct,
    CustomResourceTagConstruct,
    CustomSecurityGroupConstruct,
    PulsifiTeam,
} from '@pulsifi/custom-aws-cdk-lib';
import {
    type Code,
    Duration,
    RemovalPolicy,
    type Size,
    Tags,
} from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import {
    Function as AwsFunctionLambda,
    type FunctionProps,
    type LayerVersion,
    ParamsAndSecretsLayerVersion,
    ParamsAndSecretsVersions,
    Runtime,
    type Version,
} from 'aws-cdk-lib/aws-lambda';
import {
    SnsEventSource,
    type SnsEventSourceProps,
    SqsEventSource,
    type SqsEventSourceProps,
} from 'aws-cdk-lib/aws-lambda-event-sources';
import { type ILogGroup, LogGroup } from 'aws-cdk-lib/aws-logs';
import type { ITopic } from 'aws-cdk-lib/aws-sns';
import type { IQueue } from 'aws-cdk-lib/aws-sqs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { ResourceTag } from '../constants';
import { BuildScriptProvider, configUtil } from '../utils';
import { environment, version } from '../variables';

/**
 * BundlingAssets
 *
 * @param from
 * @param to
 */
type BundlingAssets = {
    from: string[];
    to: string[];
};

/**
 * LambdaSpecificEnvironmentVariables
 */
type LambdaSpecificEnvironmentVariables = Record<string, string>;

/**
 * CustomFunctionProps
 *
 * @param functionName
 * @param description
 * @param entry
 * @param iamRole
 * @param layers
 * @optional lambdaSpecificEnvironmentVariables
 * @optional isLogGroupExists
 * @optional handler
 * @optional runtime
 * @optional code
 * @optional bundlingAssets {@link BundlingAssets}
 * @optional timeout
 * @optional ephemeralStorageSize
 * @optional memorySize
 * @optional reservedConcurrentExecutions
 * @optional sqsEventSources
 * @optional snsEventSources
 */
type CustomFunctionProps<T extends LambdaSpecificEnvironmentVariables> = {
    functionName: string;
    description: string;
    entry: string;
    iamRole: IRole;
    layers: LayerVersion[];
    lambdaSpecificEnvironmentVariables?: T;
    isLogGroupExists?: boolean;
    handler?: string;
    runtime?: Runtime;
    code?: Code;
    bundlingAssets?: BundlingAssets[];
    timeout?: Duration;
    ephemeralStorageSize?: Size;
    memorySize?: number;
    reservedConcurrentExecutions?: number;
    sqsEventSources?: {
        queue: IQueue;
        sqsEventSourceProps?: SqsEventSourceProps;
    }[];
    snsEventSources?: {
        topic: ITopic;
        snsEventSourceProps?: SnsEventSourceProps;
    }[];
};

export class BaseFunction<
    T extends LambdaSpecificEnvironmentVariables,
> extends Construct {
    public readonly lambda: AwsFunctionLambda;
    public readonly lambdaVersion: Version;
    private eventRuleCount = 1;

    /**
     * BaseFunction
     *
     * @public lambda
     * @public lambdaVersion
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomFunctionProps}
     */
    constructor(scope: Construct, id: string, props: CustomFunctionProps<T>) {
        super(scope, id);

        const {
            iamRole,
            sqsEventSources,
            snsEventSources,
            lambdaSpecificEnvironmentVariables,
            ...lambdaProps
        } = props;

        /* log group */
        let logGroup: ILogGroup;
        if (props.isLogGroupExists) {
            logGroup = LogGroup.fromLogGroupName(
                scope,
                `${id}-log-group`,
                `/aws/lambda/${props.functionName}`,
            );
        } else {
            const logGroupConstruct = new CustomLambdaLogGroupConstruct(
                scope,
                `${id}-log-group`,
                {
                    awsEnvironment: environment,
                    resourceOwner: PulsifiTeam.ENGINEERING,
                    lambdaName: `${props.functionName}`,
                },
            );

            logGroup = logGroupConstruct.logGroup;
        }

        /* default lambda configuration */
        const defaultLambdaConfiguration: FunctionProps = {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_20_X,
            memorySize: 256,
            timeout: Duration.seconds(30),
            environment: {
                ...configUtil.getEnvironmentVariables(scope, environment),
                ...lambdaSpecificEnvironmentVariables,
            },
            role: iamRole,
            paramsAndSecrets: ParamsAndSecretsLayerVersion.fromVersion(
                ParamsAndSecretsVersions.V1_0_103,
            ),
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.RETAIN,
            },
            vpc: Vpc.fromLookup(scope, `${id}-vpc`, {
                vpcId: StringParameter.valueFromLookup(scope, '/configs/VPCID'),
            }),
            allowPublicSubnet: true,
            securityGroups: [
                SecurityGroup.fromSecurityGroupId(
                    scope,
                    `${id}-security-group`,
                    StringParameter.valueFromLookup(
                        scope,
                        '/talent-management-fn/VPC_SECURITY_GROUP_IDS',
                    ),
                ),
            ],
            ...lambdaProps,
            code: new TypeScriptCode(props.entry, {
                buildProvider: new BuildScriptProvider(
                    'cdk/lib/utils/esbuild/build.mjs',
                    {
                        /* specifies additional external modules to exclude from bundling */
                        externalModules: ['layer/nodejs/package.json'],
                    },
                ),
                buildOptions: {
                    outfile: 'index.js',
                },
            }),
            logGroup: logGroup,
        };

        /* lambda version */
        this.lambda = new AwsFunctionLambda(
            this,
            'Lambda',
            defaultLambdaConfiguration,
        );

        this.lambdaVersion = this.lambda.currentVersion;

        /* tags */
        new CustomResourceTagConstruct(this, `${id}-tagging`, {
            construct: this,
            awsEnvironment: environment,
            resourceOwner: PulsifiTeam.ENGINEERING,
            resourceName: props.functionName,
        });

        Tags.of(scope).add('Type', ResourceTag.LAMBDA);
        Tags.of(scope).add('Version', version);

        /* lambda error alarm */
        new CustomLambdaErrorAlarmConstruct(this, `${id}-error-alarm`, {
            awsEnvironment: environment,
            resourceOwner: PulsifiTeam.ENGINEERING,
            lambda: this.lambda,
        });

        /* lambda security group */
        new CustomSecurityGroupConstruct(this, `${id}-security-group`, {
            resourceName: props.functionName,
            awsEnvironment: environment,
            resourceOwner: PulsifiTeam.ENGINEERING,
        });

        /* lambda triggers */
        if (sqsEventSources) {
            for (const eventSource of sqsEventSources) {
                this.addSqsEventSource(
                    eventSource.queue,
                    eventSource.sqsEventSourceProps,
                );
            }
        }

        if (snsEventSources) {
            for (const eventSource of snsEventSources) {
                this.addSnsEventSource(
                    eventSource.topic,
                    eventSource.snsEventSourceProps,
                );
            }
        }
    }

    private addSqsEventSource(queue: IQueue, props?: SqsEventSourceProps) {
        this.lambda.addEventSource(new SqsEventSource(queue, props));

        return this;
    }

    private addSnsEventSource(topic: ITopic, props?: SnsEventSourceProps) {
        this.lambda.addEventSource(new SnsEventSource(topic, props));

        return this;
    }
}
