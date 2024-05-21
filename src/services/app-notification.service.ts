import { EventModel } from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import { ApplicationWithdraw } from '../interface';
import { UserNotificationSetting } from '../models';
import {
    EmailNotificationService,
    IdentityService,
    PushNotificationService,
} from '.';

export class AppNotificationService {
    private readonly identityService: IdentityService;
    private readonly pushNotificationService: PushNotificationService;
    private readonly emailNotificationService: EmailNotificationService;

    constructor(private readonly dataSource: DataSource) {
        this.identityService = new IdentityService();
        this.pushNotificationService = new PushNotificationService();
        this.emailNotificationService = new EmailNotificationService(
            dataSource,
        );
    }

    getAllUserNotificationSettings = async (
        companyId: number,
        notificationEventType: string,
    ): Promise<UserNotificationSetting[]> => {
        return this.dataSource.getRepository(UserNotificationSetting).find({
            where: {
                company_id: companyId,
                notification_event_type: notificationEventType,
                is_deleted: false,
            },
        });
    };

    async notifyApplicationWithdraw(message: EventModel<JSON>): Promise<void> {
        const applicationWithdrawPayload: ApplicationWithdraw = <
            ApplicationWithdraw
        >(<unknown>message.data);

        const notificationEventType = message.event_type;

        const userNotificationSettings =
            await this.getAllUserNotificationSettings(
                applicationWithdrawPayload.company_id,
                notificationEventType,
            );

        if (userNotificationSettings.length === 0) {
            return;
        }

        const userAccountIds = userNotificationSettings.map(
            (i) => i.user_account_id,
        );
        const userAccountDetails =
            await this.identityService.getUsersByUserAccounts(userAccountIds);

        await this.emailNotificationService.sendEmailNotification(
            notificationEventType,
            userNotificationSettings,
            userAccountDetails,
        );
    }
}
