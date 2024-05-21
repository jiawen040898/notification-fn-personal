import {
    SendEmailCommand,
    SendEmailRequest,
    SESClient,
} from '@aws-sdk/client-ses';
import { AdaptiveRetryStrategy } from '@aws-sdk/middleware-retry';
import { DedicatedUserAccountId, logger, objectParser } from '@pulsifi/fn';
import { encode as rfcEncode } from 'rfc2047';
import { DataSource, In } from 'typeorm';

import * as AWSConfig from '../configs';
import {
    DefaultLocale,
    EmailTemplateCommunicationType,
    EmailTemplateUsage,
} from '../constants';
import { IEmailRequest } from '../interface';
import {
    EmailActivityMessage,
    EmailActivityMessageDeliveryStatus,
    EmailActivityMessageFailureCode,
    EmailActivityMessageRecipientGroup,
    EmailTemplate,
} from '../models';
import { templateEngine } from '../utils';
import { CompanyService } from './company.service';

export class SendEmailService {
    constructor(private readonly dataSource: DataSource) {}

    constructEmailRequest = (
        toAddress: string,
        subject: string,
        bodyInHtml: string,
        senderName: string,
        senderEmail: string,
        emailCommunicationType: string,
        shouldTrackMetric = false,
    ): SendEmailRequest => {
        const fromAddress = `${rfcEncode(senderName)} <${senderEmail}>`;

        return {
            Message: {
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: bodyInHtml,
                    },
                },
            },
            Destination: {
                ToAddresses: [toAddress],
            },
            Source: fromAddress,
            ReplyToAddresses: [],
            Tags: [
                {
                    Name: 'emailCommunicationType',
                    Value: emailCommunicationType,
                },
            ],
            ...(shouldTrackMetric
                ? {
                      ConfigurationSetName:
                          AWSConfig.ses().configurationSetName,
                  }
                : {}),
        };
    };

    async sendSESEmail(emailRequest: SendEmailRequest): Promise<{
        success: boolean;
        sesMessageId?: string;
        error?: SafeAny;
    }> {
        try {
            const retryStrategy = new AdaptiveRetryStrategy(() =>
                Promise.resolve(2),
            );
            const sesConfig = AWSConfig.ses();
            const sesClient = new SESClient({
                region: sesConfig.region,
                apiVersion: sesConfig.apiVersion,
                maxAttempts: 2,
                retryStrategy,
            });
            const command = new SendEmailCommand(emailRequest);

            const data = await sesClient.send(command);
            return {
                success: true,
                sesMessageId: data.MessageId,
            };
        } catch (err) {
            logger.error('Fail to send email.', { err, emailRequest });
            throw err;
        }
    }

    async saveEmailActivityMessage(payload: Partial<EmailActivityMessage>) {
        await this.dataSource
            .getRepository(EmailActivityMessage)
            .save(payload, { reload: false });
    }

    async getEmailTemplate(
        companyId: number,
        emailTemplateId?: number,
        emailCommunicationType?: EmailTemplateCommunicationType,
    ): Promise<EmailTemplate> {
        // Get email template when there is Email template ID
        let emailTemplate = await this.getExistingEmailTemplateById(
            emailTemplateId,
        );

        if (!emailTemplate) {
            const companyService = new CompanyService();
            const companyLocale =
                await companyService.getCompanyLocaleByCompanyId(companyId);

            // use email communication type when there is no emailTemplateId
            if (emailCommunicationType) {
                emailTemplate =
                    await this.getEmailTemplateByEmailCommunicationTypeOrCompanyId(
                        companyId,
                        emailCommunicationType,
                        companyLocale,
                    );
            }

            if (!emailTemplate) {
                logger.error('No email template found.', {
                    emailTemplateId,
                    emailCommunicationType,
                });
                throw new Error('No email template found.');
            }
        }
        return emailTemplate;
    }

    private async getExistingEmailTemplateById(
        emailTemplateId?: number,
    ): Promise<EmailTemplate | null> {
        if (!emailTemplateId) {
            return null;
        }
        return this.dataSource.getRepository(EmailTemplate).findOne({
            where: { id: emailTemplateId, is_deleted: false },
            cache: 10000,
        });
    }

    private async getEmailTemplateByEmailCommunicationTypeOrCompanyId(
        companyId: number,
        emailCommunicationType: EmailTemplateCommunicationType,
        companyLocale: string,
    ): Promise<EmailTemplate | null> {
        const systemEmailTemplates = await this.dataSource
            .getRepository(EmailTemplate)
            .find({
                where: {
                    email_communication_type: emailCommunicationType,
                    is_deleted: false,
                    usage: In([
                        EmailTemplateUsage.SYSTEM,
                        EmailTemplateUsage.DEFAULT,
                    ]),
                },
                cache: 10000,
            });

        const clientEmailTemplate = await this.dataSource
            .getRepository(EmailTemplate)
            .findOne({
                where: {
                    email_communication_type: emailCommunicationType,
                    language: companyLocale,
                    is_deleted: false,
                    usage: In([EmailTemplateUsage.CLIENT]),
                    company_id: companyId,
                },
                cache: 10000,
            });

        if (clientEmailTemplate) {
            return clientEmailTemplate;
        }

        const localeSystemEmailTemplate = systemEmailTemplates.find(
            (template) => {
                return template.language === companyLocale;
            },
        );

        if (localeSystemEmailTemplate) {
            return localeSystemEmailTemplate;
        }

        // in case still cannot find, get the english version
        // case happens when company locale has [en, pt] but emailTemplates only have [en, fr]
        // when pt is passed in the previous condition, it would be undefined,
        // hence returns the default email template 'en' which will forever be there
        const defaultEnglishTemplate = systemEmailTemplates.find((template) => {
            return template.language === DefaultLocale;
        });

        if (defaultEnglishTemplate) {
            return defaultEnglishTemplate;
        }

        return null;
    }

    async sendEmail(emailRequest: IEmailRequest) {
        const {
            variables,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            recipient_email,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            recipient_id,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            recipient_group = EmailActivityMessageRecipientGroup.USER,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            email_template_id,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            email_communication_type,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            company_id = 0,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            email_template,
        } = emailRequest;

        // TODO check if company is test, or email communication is on/off, or block certain email domain
        const canSendEmail = true;

        const foundEmailTemplate = await this.getEmailTemplate(
            company_id,
            email_template_id,
            email_communication_type as EmailTemplateCommunicationType,
        );

        foundEmailTemplate.subject =
            email_template?.subject ?? foundEmailTemplate.subject;
        foundEmailTemplate.body_in_html =
            email_template?.body_in_html ?? foundEmailTemplate.body_in_html;

        // TODO enrich variable with company name by reading from redis or identity api
        const bodyVariables = {
            ...variables,
        };

        const renderedBodyResponse = await templateEngine.parseAndRender(
            foundEmailTemplate.body_in_html,
            bodyVariables,
        );

        const renderedSubjectResponse = await templateEngine.parseAndRender(
            foundEmailTemplate.subject,
            bodyVariables,
        );

        const renderedSenderNameResponse = await templateEngine.parseAndRender(
            foundEmailTemplate.sender_name,
            bodyVariables,
        );

        const emailBody = renderedBodyResponse.content;
        const emailSubject = renderedSubjectResponse.content;
        const emailSenderName = renderedSenderNameResponse.content;

        const basePayload: Partial<EmailActivityMessage> = {
            company_id:
                company_id > 0 ? company_id : foundEmailTemplate.company_id,
            email_template_id: foundEmailTemplate.id,
            email_communication_type:
                foundEmailTemplate.email_communication_type,
            recipient_email,
            recipient_id,
            recipient_group,
            body_variables: objectParser.toJSON(bodyVariables),
            body_in_html: emailBody,
            subject: emailSubject,
            sender_name: emailSenderName,
            sender_email: AWSConfig.pulsifi().senderEmail,
            created_by: DedicatedUserAccountId.SYSTEM,
            updated_by: DedicatedUserAccountId.SYSTEM,
        };

        if (!renderedBodyResponse.success) {
            const payload = {
                ...basePayload,
                delivery_status: EmailActivityMessageDeliveryStatus.FAILED,
                failure_reason_code:
                    EmailActivityMessageFailureCode.PARSER_ERROR,
                failure_detail: renderedBodyResponse.error,
            };
            await this.saveEmailActivityMessage(payload);
            return;
        }

        if (!canSendEmail) {
            const payload = {
                ...basePayload,
                delivery_status: EmailActivityMessageDeliveryStatus.NOT_SENT,
            };
            await this.saveEmailActivityMessage(payload);
            return;
        }

        const emailRequestTemplate = this.constructEmailRequest(
            recipient_email,
            emailSubject,
            emailBody,
            emailSenderName,
            AWSConfig.pulsifi().senderEmail,
            foundEmailTemplate.email_communication_type,
            foundEmailTemplate.usage === EmailTemplateUsage.SYSTEM,
        );

        const sesResponse = await this.sendSESEmail(emailRequestTemplate);

        if (!sesResponse.success) {
            const payload = {
                ...basePayload,
                body_in_html: emailBody,
                delivery_status: EmailActivityMessageDeliveryStatus.FAILED,
                failure_reason_code: EmailActivityMessageFailureCode.API_ERROR,
                failure_detail: sesResponse.error,
            };
            await this.saveEmailActivityMessage(payload);
            return;
        }

        const payload = {
            ...basePayload,
            body_in_html: emailBody,
            delivery_status: EmailActivityMessageDeliveryStatus.SENT,
            ext_ses_message_id: sesResponse.sesMessageId,
            sent_at: new Date(),
        };
        await this.saveEmailActivityMessage(payload);

        logger.info('Email sent successfully.', { data: sesResponse });
    }
}
