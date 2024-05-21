import { dateTimeUtil, generatorUtil, objectParser } from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import {
    DefaultLocale,
    EmailTemplateCommunicationType,
    EmailTemplateUsage,
    Locale,
} from '../../src/constants';
import { validateEmailTemplateVariableLink } from '../../src/functions/send-email';
import { IEmailRequest } from '../../src/interface';
import {
    EmailActivityMessage,
    EmailActivityMessageDeliveryStatus,
    EmailActivityMessageRecipientGroup,
    EmailTemplate,
} from '../../src/models';
import { SendEmailService } from '../../src/services';
import { testData } from '../fixtures';
import { getTestDataSourceAndAddData } from '../setup/test-database.setup';

const mockSESClient = {
    send: jest.fn(),
};

jest.mock('../../src/services/company.service', () => {
    const mBInstance = {
        getCompanyData: jest.fn(() => [testData.companyDataResponse]),
        getCompanyLocaleByCompanyId: jest.fn(() => [DefaultLocale]),
    };
    const mB = jest.fn(() => mBInstance);
    return { CompanyService: mB };
});

jest.mock('@aws-sdk/client-ses', () => {
    return {
        ...jest.requireActual('@aws-sdk/client-ses'),
        SESClient: jest.fn(() => mockSESClient),
    };
});

jest.mock('@pulsifi/fn/utils/logger.util');

describe('sendEmail', () => {
    let dataSource: DataSource;
    const sesMessageId = generatorUtil.uuid();

    beforeAll(async () => {
        const emailTemplate: EmailTemplate = {
            id: 1,
            company_id: 1,
            subject: 'Hello world {{job_title}}',
            sender_name: '{{sender_name}} via Pulsifi',
            email_communication_type:
                EmailTemplateCommunicationType.APPLICATION_SHORTLIST,
            body_in_html: '<html>Hello {{first_name}} {{year}}</html>',
            usage: EmailTemplateUsage.CLIENT,
            language: Locale.EN_US,
            is_deleted: false,
            created_by: 1,
            updated_by: 1,
        };

        const systemFeedbackEmailTemplate: EmailTemplate = {
            id: 2,
            company_id: 0,
            subject: 'Hello world {{feedback_cycle.name}}',
            sender_name: '{{sender_name}} via Pulsifi',
            email_communication_type:
                EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED,
            body_in_html: '<html>Hello {{first_name}} {{year}}</html>',
            usage: EmailTemplateUsage.SYSTEM,
            language: Locale.EN_US,
            is_deleted: false,
            created_by: 1,
            updated_by: 1,
        };

        const emailLog: EmailActivityMessage = {
            id: 1,
            company_id: 1,
            email_template_id: 1,
            delivery_status: EmailActivityMessageDeliveryStatus.SENT,
            subject: 'Hello world MT Program',
            sender_email: 'sender@domain.com',
            sender_name: 'Sender',
            email_communication_type: 'application_shortlisted',
            body_in_html: `<html>Hello David ${dateTimeUtil.getCurrentYear()}</html>`,
            recipient_email: 'da@da.com',
            recipient_group: 'user',
            body_variables: objectParser.toJSON({}),
            recipient_id: sesMessageId,
            ext_ses_message_id: sesMessageId,
            open_count: 0,
            click_count: 0,
            is_deleted: false,
            sent_at: new Date(),
            created_by: 1,
            updated_by: 1,
        };

        dataSource = await getTestDataSourceAndAddData([
            {
                entityClass: EmailTemplate,
                data: [emailTemplate, systemFeedbackEmailTemplate],
            },
            {
                entityClass: EmailActivityMessage,
                data: emailLog,
            },
        ]);
    });

    afterAll(() => {
        dataSource.destroy();
        jest.resetAllMocks();
    });

    beforeEach(() => {
        mockSESClient.send.mockReset();
    });

    it('should pass sending email', async () => {
        // Arrange
        mockSESClient.send.mockResolvedValue({
            data: {
                MessageId: 1,
            },
        });

        const data: IEmailRequest = {
            recipient_id: sesMessageId,
            recipient_email: 'dav@emai.com',
            recipient_group: EmailActivityMessageRecipientGroup.USER,
            email_template_id: 1,
            variables: {
                first_name: 'David',
                job_title: 'MT Program',
                sender_name: 'Nestlé',
            },
        };

        // Act
        await new SendEmailService(dataSource).sendEmail(data);

        // Assert
        const foundEmailLog = await dataSource
            .getRepository(EmailActivityMessage)
            .findOneBy({ recipient_id: data.recipient_id });

        expect(foundEmailLog?.subject).toEqual('Hello world MT Program');
        expect(foundEmailLog?.body_in_html).toEqual(
            `<html>Hello David ${dateTimeUtil.getCurrentYear()}</html>`,
        );
        expect(foundEmailLog?.delivery_status).toEqual(
            EmailActivityMessageDeliveryStatus.SENT,
        );
        expect(foundEmailLog?.sent_at).not.toBeNull();
        expect(mockSESClient.send.mock.calls).toMatchSnapshot();
    });

    it('should fail sending email with ses error', async () => {
        // Arrange
        mockSESClient.send.mockRejectedValue(new Error('SES Fail'));

        const data: IEmailRequest = {
            recipient_id: generatorUtil.uuid(),
            recipient_email: 'dav@emai.com',
            recipient_group: EmailActivityMessageRecipientGroup.USER,
            email_template_id: 1,
            variables: {
                first_name: 'David',
            },
        };

        // Act
        const action = async () => {
            await new SendEmailService(dataSource).sendEmail(data);
        };

        // Assert
        await expect(action()).rejects.toThrow(Error);
    });

    it('should pass sending email with email template data ', async () => {
        // Arrange
        mockSESClient.send.mockResolvedValue({
            data: {
                MessageId: 1,
            },
        });

        const data: IEmailRequest = {
            company_id: 9,
            recipient_id: sesMessageId,
            recipient_email: 'dav@emai.com',
            recipient_group: EmailActivityMessageRecipientGroup.USER,
            // email_template_id: 1,
            email_communication_type:
                EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED,
            variables: {
                cycle: {
                    name: 'Q1 FC',
                },
                receiver: {
                    first_name: 'Benny',
                    last_name: 'Ng',
                    full_name: 'Benny Ng',
                    user_account_id: 1,
                    employee_id: 'Anything',
                    email: 'da@da.com',
                    id: 'Anything',
                },
            },
            email_template: {
                subject: 'Please submit your nomination for {{cycle.name}}',
                body_in_html: '<html>Hello {{reviewe.name}}</html>',
            },
        };

        // Act
        await new SendEmailService(dataSource).sendEmail(data);

        // Assert
        const foundEmailLog = await dataSource
            .getRepository(EmailActivityMessage)
            .findOneBy({ recipient_id: data.recipient_id });

        expect(foundEmailLog?.subject).toMatchSnapshot();
        expect(foundEmailLog?.body_in_html).toMatchSnapshot();
        expect(foundEmailLog?.delivery_status).toEqual(
            EmailActivityMessageDeliveryStatus.SENT,
        );
        expect(foundEmailLog?.sent_at).not.toBeNull();
        expect(mockSESClient.send.mock.calls).toMatchSnapshot();
    });

    describe('validateEmailTemplateVariableLink', () => {
        it('should throw error if url is invalid', () => {
            // Arrange
            const variables = {
                employee_app_url: 'invalid_url',
            };

            // Act
            const action = () => {
                validateEmailTemplateVariableLink(variables);
            };

            // Assert
            expect(action).toThrowErrorMatchingSnapshot();
        });

        it('should throw error if link is invalid', () => {
            // Arrange
            const variables = {
                invite_link: 'invalid_url',
            };

            // Act
            const action = () => {
                validateEmailTemplateVariableLink(variables);
            };

            // Assert
            expect(action).toThrowErrorMatchingSnapshot();
        });

        it('should not return any error if url and links are fine', () => {
            // Arrange
            const variables = {
                employee_app_url: 'https://www.google.com',
                invite_link: 'https://www.google.com',
                company_id: 5,
            };

            // Act
            const action = () => {
                validateEmailTemplateVariableLink(variables);
            };

            // Assert
            expect(action).not.toThrow();
        });
    });
});
