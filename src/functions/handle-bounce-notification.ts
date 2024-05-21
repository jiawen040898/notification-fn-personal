import { logger } from '@pulsifi/fn';
import { Handler, SNSEvent } from 'aws-lambda';

import { getDataSource } from '../database';
import { ISESNotification } from '../interface';
import { eventMiddleware } from '../middleware';
import { EmailTrackingService } from '../services';

const handleEvent: Handler = async (_event: SNSEvent) => {
    const dataSource = await getDataSource();
    const emailDeliveryStatusService = new EmailTrackingService(dataSource);
    let sesNotification: ISESNotification;
    try {
        sesNotification = JSON.parse(_event.Records[0].Sns.Message);
    } catch (error) {
        logger.error('Fail to parse message', { data: _event });
        throw error;
    }
    await emailDeliveryStatusService.updateEmailDeliveryStatus(sesNotification);
};

export const handler = eventMiddleware(handleEvent);
