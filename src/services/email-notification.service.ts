import { sqsService } from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import * as AWSConfig from '../configs';
import {
    IEmailRequest,
    IEmailTemplate,
    ITemplateVariable,
    UserAccount,
} from '../interface';
import {
    EmailActivityMessageRecipientGroup,
    EmailTemplate,
    UserNotificationSetting,
} from '../models';

export class EmailNotificationService {
    constructor(private readonly dataSource: DataSource) {}

    prepareEmailRequest = (
        companyId: number,
        userAccountId: number,
        recipientEmail: string,
        emailCommunicationType: string,
        variables: Partial<ITemplateVariable>,
        emailTemplate?: IEmailTemplate,
    ): IEmailRequest => {
        const data: IEmailRequest = {
            recipient_id: userAccountId.toString(),
            recipient_email: recipientEmail,
            recipient_group: EmailActivityMessageRecipientGroup.USER,
            email_communication_type: emailCommunicationType,
            company_id: companyId ?? 0,
            variables,
            email_template: emailTemplate,
        };
        return data;
    };

    sendEmailRequestMessage = async (
        emailRequest: IEmailRequest,
    ): Promise<void> => {
        const sqsConfig = AWSConfig.emailSqs();

        return sqsService.send(emailRequest, {
            region: sqsConfig.region,
            apiVersion: sqsConfig.apiVersion,
            queueUrl: sqsConfig.emailRequestQueue,
        });
    };

    async getEmailCommunicationType(
        notificationEventType: string,
    ): Promise<string | undefined> {
        notificationEventType;
        const foundEmailTemplate = await this.dataSource
            .getRepository(EmailTemplate)
            .findOne({
                where: {
                    notification_event_type: notificationEventType,
                    is_deleted: false,
                },
            });
        return foundEmailTemplate?.email_communication_type;
    }

    async sendEmailNotification(
        notificationEventType: string,
        userNotificationSettings: UserNotificationSetting[],
        userAccountDetails: UserAccount[],
    ) {
        const emailNotifications = userNotificationSettings.filter(
            (i) => i.is_email_notification_enabled,
        );

        if (emailNotifications.length === 0) {
            return;
        }

        const emailCommunicationType = await this.getEmailCommunicationType(
            notificationEventType,
        );

        if (!emailCommunicationType) {
            return;
        }

        for (const emailNotificationItem of emailNotifications) {
            const currentUserAccount = userAccountDetails.find(
                (i) => i.id === emailNotificationItem.user_account_id,
            );
            if (currentUserAccount) {
                const emailRequest = this.prepareEmailRequest(
                    0,
                    emailNotificationItem.user_account_id,
                    currentUserAccount.email,
                    emailCommunicationType,
                    {
                        //TODO
                        // first_name: emailUserAccountItem.first_name,
                        // last_name: emailUserAccountItem.last_name,
                        // job_title: applicationWithdrawPayload.job_title,
                        // company_name: foundUserApplication?.company_name,
                    },
                );
                await this.sendEmailRequestMessage(emailRequest);
            }
        }
    }
}
