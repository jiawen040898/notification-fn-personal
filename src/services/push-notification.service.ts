import { secretService, sqsService } from '@pulsifi/fn';
import Pusher from 'pusher';

import * as AWSConfig from '../configs';
import { AppActivityType, IconType } from '../constants';
import { IPushNotificationRequest, ITemplateVariable } from '../interface';

type PusherSecret = {
    PUSHER_APP_ID: string;
    PUSHER_KEY: string;
    PUSHER_SECRET: string;
    PUSHER_CLUSTER: string;
};

export class PushNotificationService {
    preparePushNotificationRequest = (
        companyId: number,
        userAccountId: number,
        appActivityType: AppActivityType,
        icon: IconType,
        createdBy: number,
        variables: Partial<ITemplateVariable>,
    ): IPushNotificationRequest => {
        return {
            company_id: companyId,
            user_account_id: userAccountId,
            message_category: appActivityType,
            icon,
            created_by: createdBy,
            variables,
        };
    };

    sendPushNotificationRequestMessage = (
        pushNotificationRequest: IPushNotificationRequest,
    ): Promise<void> => {
        const sqsConfig = AWSConfig.pushNotificationSqs();

        return sqsService.send(pushNotificationRequest, {
            region: sqsConfig.region,
            apiVersion: sqsConfig.apiVersion,
            queueUrl: sqsConfig.pushNotificationQueue,
        });
    };

    async sendPushNotification(
        sendPushNotificationRequest: IPushNotificationRequest,
    ): Promise<void> {
        const pusherSecret = await secretService.getSecret<PusherSecret>(
            process.env.PUSHER_SM_NAME as string,
        );

        const pusher = new Pusher({
            appId: pusherSecret.PUSHER_APP_ID,
            key: pusherSecret.PUSHER_KEY,
            secret: pusherSecret.PUSHER_SECRET,
            cluster: pusherSecret.PUSHER_CLUSTER,
            useTLS: true,
        });

        const pusherId = `${sendPushNotificationRequest.company_id}-${sendPushNotificationRequest.variables?.employee_user_account_id}`;

        await pusher.sendToUser(pusherId, 'notification', {});
    }
}
