import middy from '@middy/core';
import { initSentryMiddleware, loggerMiddleware } from '@pulsifi/fn';
import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';

import { version } from '../package.json';

initSentryMiddleware(version);

export const eventMiddleware = (handler: Handler): Handler =>
    Sentry.AWSLambda.wrapHandler(
        middy(handler).use([
            // ssm({
            //     setToContext: true,
            //     fetchData: {
            //         pusherBeamsInstanceId:
            //             '/notification-fn/PUSHER_BEAMS_INSTANCE_ID',
            //         pusherBeamsSecretKey:
            //             '/notification-fn/PUSHER_BEAMS_SECRET_KEY',
            //     },
            // }),
            loggerMiddleware(),
        ]),
        {
            timeoutWarningLimit: 5.5,
        },
        // .before(async (request) => {
        //     const data = await getInternal(
        //         ['pusherBeamsInstanceId', 'pusherBeamsSecretKey'],
        //         request,
        //     );
        //
        //     PusherConfig.beamsInstanceId = data.pusherBeamsInstanceId;
        //     PusherConfig.beamsSecretKey = data.pusherBeamsSecretKey;
        // }),
    );
