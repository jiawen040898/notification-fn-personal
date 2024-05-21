import { logger, objectParser } from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import {
    ISESNotification,
    NotificationType,
} from '../interface/ses-notification';
import {
    EmailActivityMessage,
    EmailActivityMessageDeliveryStatus,
    EmailActivityMessageFailureCode,
} from '../models/email-activity-message.entity';

export class EmailTrackingService {
    constructor(private readonly dataSource: DataSource) {}

    async getEmailActivityMessage(
        sesMessageId: string,
    ): Promise<EmailActivityMessage | null> {
        return this.dataSource.getRepository(EmailActivityMessage).findOneBy({
            ext_ses_message_id: sesMessageId,
        });
    }

    async updateEmailDeliveryStatus(sesNotification: ISESNotification) {
        const {
            notificationType,
            mail,
            bounce,
            complaint,
            open,
            click,
        }: ISESNotification = sesNotification;

        const foundEmailActivityMessage = await this.getEmailActivityMessage(
            mail.messageId,
        );

        //There is still email send from legacy platform, so is fine to ignore if not found
        if (!foundEmailActivityMessage) {
            return;
        }

        if (notificationType === NotificationType.BOUNCE) {
            foundEmailActivityMessage.delivery_status =
                EmailActivityMessageDeliveryStatus.BOUNCED;
            foundEmailActivityMessage.failure_reason_code =
                EmailActivityMessageFailureCode.BOUNCED;
            foundEmailActivityMessage.failure_detail =
                objectParser.toJSON(bounce);
        } else if (notificationType === NotificationType.COMPLAINT) {
            foundEmailActivityMessage.complaint_detail =
                objectParser.toJSON(complaint);
        } else if (notificationType === NotificationType.OPEN) {
            foundEmailActivityMessage.open_count =
                (foundEmailActivityMessage.open_count ?? 0) + 1;
            foundEmailActivityMessage.open_detail = objectParser.toJSON(open);
        } else if (notificationType === NotificationType.CLICK) {
            foundEmailActivityMessage.click_count =
                (foundEmailActivityMessage.click_count ?? 0) + 1;
            foundEmailActivityMessage.click_detail = objectParser.toJSON(click);
        }
        await this.dataSource.transaction(async (manager) => {
            await manager.save(EmailActivityMessage, foundEmailActivityMessage);
        });

        logger.info('SES notification updated.', {
            data: {
                notificationType,
                sesMessageId: foundEmailActivityMessage.ext_ses_message_id,
                emailActivityMessageId: foundEmailActivityMessage.id,
            },
        });
    }
}
