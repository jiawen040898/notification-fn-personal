import { sqsRecordUtil } from '@pulsifi/fn';
import { Handler, SQSEvent } from 'aws-lambda';

import { IPushNotificationRequest } from '../interface';
import { eventMiddleware } from '../middleware';
import { PushNotificationService } from '../services';

const handleEvent: Handler = async (event: SQSEvent): Promise<void> => {
    const pushNotificationService = new PushNotificationService();
    for (const record of event.Records) {
        const pushNotificationRequest =
            sqsRecordUtil.parseBody<IPushNotificationRequest>(record);

        await pushNotificationService.sendPushNotification(
            pushNotificationRequest,
        );
    }
};

export const handler = eventMiddleware(handleEvent);
