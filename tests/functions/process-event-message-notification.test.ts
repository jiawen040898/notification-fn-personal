import { EventModel, generatorUtil, objectParser } from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import {
    EmailTemplateCommunicationType,
    EmailTemplateUsage,
    Locale,
} from '../../src/constants';
import { ApplicationWithdraw } from '../../src/interface';
import {
    AppMessageTemplate,
    EmailTemplate,
    UserNotificationSetting,
} from '../../src/models';
import { AppNotificationService } from '../../src/services';
import { pusher } from '../../src/utils/pusher.util';
import { getTestDataSource } from '../setup/test-database.setup';

jest.mock('../../src/services/identity.service', () => {
    const mBInstance = {
        getUsersByUserAccounts: jest.fn(() => [
            {
                id: 1,
                email: 'david@pulsif.me',
                first_name: 'Abu',
                last_name: 'Akao',
                userApplications: [],
            },
        ]),
    };
    const mB = jest.fn(() => mBInstance);
    return { IdentityService: mB };
});

const mockPublishWebappMessage = jest.fn();
pusher.publishWebAppMessage = mockPublishWebappMessage;

const mockSQSClient = {
    send: jest.fn(),
};

jest.mock('@aws-sdk/client-sqs', () => {
    const actualFn = jest.requireActual('@aws-sdk/client-sqs');
    return {
        ...actualFn,
        SQSClient: jest.fn(() => mockSQSClient),
    };
});

describe('[processEventMessageNotification]', () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await getTestDataSource();

        await dataSource.transaction(async (manager) => {
            const emailTemplatePayload: EmailTemplate = {
                id: 1,
                company_id: 1,
                subject: 'Hello world {{job_title}}',
                sender_name: 'Sender',
                email_communication_type:
                    EmailTemplateCommunicationType.APPLICATION_SHORTLIST,
                notification_event_type: 'application_withdraw',
                body_in_html: '<html>Hello {{first_name}}</html>',
                usage: EmailTemplateUsage.CLIENT,
                language: Locale.EN_US,
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
            };
            await manager.save(EmailTemplate, emailTemplatePayload);

            const appMessageTemplatePayload: AppMessageTemplate = {
                id: 1,
                title: 'Hello world {{job_title}}',
                body: 'Hello world {{job_title}}',
                body_in_html: '<html>Hello {{first_name}}</html>',
                notification_event_type: 'application_withdraw',
                message_category: 'Announcement',
                language: 'en',
                priority: 0,
                link_url: '',
                link_text: '',
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
            };
            await manager.save(AppMessageTemplate, appMessageTemplatePayload);
        });
    });

    afterAll(() => {
        dataSource.destroy();
        jest.resetAllMocks();
    });

    beforeEach(() => {
        mockSQSClient.send.mockReset();
    });

    it('should pass notify application withdraw for send email', async () => {
        await dataSource.transaction(async (manager) => {
            const userNotificationPayload: UserNotificationSetting = {
                id: 1,
                company_id: 1,
                user_account_id: 1,
                notification_event_type: 'application_withdraw',
                is_email_notification_enabled: true,
                is_app_notification_enabled: false,
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
            };
            await manager.save(
                UserNotificationSetting,
                userNotificationPayload,
            );
        });

        const data = <ApplicationWithdraw>{
            company_id: 1,
            job_application_id: generatorUtil.uuid(),
            job_id: generatorUtil.uuid(),
            job_title: 'MT Program',
            withdrawn_reason: 'Not interest',
            withdrawn_at: new Date(),
        };
        const payload = <EventModel<JSON>>{
            company_id: 1,
            event_type: 'application_withdraw',
            user_account_id: 1,
            timestamp: new Date(),
            event_id: generatorUtil.uuid(),
            data: objectParser.toJSON(data),
        };
        const service = new AppNotificationService(dataSource);

        await service.notifyApplicationWithdraw(payload);

        expect(mockSQSClient.send.call.length).toBe(1);
    });

    it.skip('should pass notify application withdraw for push notification', async () => {
        await dataSource.transaction(async (manager) => {
            const userNotificationPayload: UserNotificationSetting = {
                id: 1,
                company_id: 1,
                user_account_id: 1,
                notification_event_type: 'application_withdraw',
                is_email_notification_enabled: false,
                is_app_notification_enabled: true,
                is_deleted: false,
                created_by: 1,
                updated_by: 1,
            };
            await manager.save(
                UserNotificationSetting,
                userNotificationPayload,
            );
        });

        const data = <ApplicationWithdraw>{
            company_id: 1,
            job_application_id: generatorUtil.uuid(),
            job_id: generatorUtil.uuid(),
            job_title: 'MT Program',
            withdrawn_reason: 'Not interest',
            withdrawn_at: new Date(),
        };
        const payload = <EventModel<JSON>>{
            company_id: 1,
            event_type: 'application_withdraw',
            user_account_id: 1,
            timestamp: new Date(),
            event_id: generatorUtil.uuid(),
            data: objectParser.toJSON(data),
        };
        const service = new AppNotificationService(dataSource);

        await service.notifyApplicationWithdraw(payload);

        expect(mockPublishWebappMessage.mock.calls.length).toBe(1);
    });
});
