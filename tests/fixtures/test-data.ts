import { EventModel, generatorUtil, objectParser } from '@pulsifi/fn';

import { AssignmentDueVariableType } from '../../src/constants';
import {
    EmployeeAssignmentEvent,
    FeedbackEvent,
    ISESNotification,
    ManagerSubordinateAggregatedReportData,
    NotificationType,
    ProgramEvent,
} from '../../src/interface';
import {
    EmailActivityMessage,
    EmailActivityMessageDeliveryStatus,
} from '../../src/models';

const sesMessageId1 = generatorUtil.uuid();
const sesMessageId2 = generatorUtil.uuid();

const emailLog1: EmailActivityMessage = {
    id: 1,
    company_id: 1,
    email_template_id: 1,
    delivery_status: EmailActivityMessageDeliveryStatus.SENT,
    subject: 'Hellow world',
    sender_email: 'sender@domain.com',
    sender_name: 'Sender',
    email_communication_type: 'application_shortlisted',
    body_in_html: '<html>Hello {{first_name}}</html?>',
    recipient_email: 'da@da.com',
    recipient_group: 'user',
    body_variables: objectParser.toJSON({}),
    ext_ses_message_id: sesMessageId1,
    open_count: 0,
    click_count: 0,
    is_deleted: false,
    created_by: 1,
    updated_by: 1,
};

const sesNotification1: ISESNotification = {
    notificationType: NotificationType.BOUNCE,
    mail: {
        messageId: sesMessageId1,
        timestamp: '1',
        source: 'source',
        sourceArn: 'sourceArn',
        sourceIp: 'sourceIp',
    },
    bounce: {
        bounceSubType: 'bounceSubType',
        bounceType: 'bounceType',
        timestamp: '1',
        feedbackId: '1',
        reportingMTA: 'reportingMTA',
    },
};

const emailLog2: EmailActivityMessage = {
    id: 1,
    company_id: 1,
    email_template_id: 1,
    delivery_status: EmailActivityMessageDeliveryStatus.SENT,
    subject: 'Hellow world',
    sender_email: 'sender@domain.com',
    sender_name: 'Sender',
    email_communication_type: 'application_shortlisted',
    body_in_html: '<html>Hello {{first_name}}</html?>',
    recipient_email: 'da@da.com',
    recipient_group: 'user',
    body_variables: objectParser.toJSON({}),
    ext_ses_message_id: sesMessageId2,
    open_count: 0,
    click_count: 0,
    is_deleted: false,
    created_by: 1,
    updated_by: 1,
};

const sesNotification2: ISESNotification = {
    notificationType: NotificationType.COMPLAINT,
    mail: {
        messageId: sesMessageId2,
        timestamp: '1',
        source: 'source',
        sourceArn: 'sourceArn',
        sourceIp: 'sourceIp',
    },
    complaint: {
        userAgent: '1',
        timestamp: '1',
        feedbackId: '1',
        complaintFeedbackType: 'complaintFeedbackType',
    },
};

const sesNotification3: ISESNotification = {
    notificationType: NotificationType.OPEN,
    mail: {
        messageId: sesMessageId1,
        timestamp: '1',
        source: 'source',
        sourceArn: 'sourceArn',
        sourceIp: 'sourceIp',
    },
    open: {
        ipAddress: '192.0.2.1',
        timestamp: '2017-08-09T22:00:19.652Z',
        userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60',
    },
};

const sesNotification4: ISESNotification = {
    notificationType: NotificationType.CLICK,
    mail: {
        messageId: sesMessageId2,
        timestamp: '1',
        source: 'source',
        sourceArn: 'sourceArn',
        sourceIp: 'sourceIp',
    },
    click: {
        ipAddress: '192.0.2.1',
        link: 'https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-smtp.html',
        linkTags: {
            samplekey0: ['samplevalue0'],
            samplekey1: ['samplevalue1'],
        },
        timestamp: '2017-08-09T23:51:25.570Z',
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    },
};

const taskAssignedEvent: EventModel<EmployeeAssignmentEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        company_id: 5,
        task_id: '5',
        task_title: 'title',
        employee_id: 'uuid',
        employee_user_account_id: 234,
        employee_email: 'test@tmeil.com',
        employee_first_name: 'First',
        employee_last_name: 'Last',
        assignor_first_name: 'First2',
        assignor_last_name: 'Last2',
        assignor_display_name: 'First2 Last2',
        assignor_user_account_id: 5,
        program_id: '23',
    },
};

const goalAssignedEvent: EventModel<EmployeeAssignmentEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        company_id: 5,
        goal_id: '5',
        goal_title: 'title',
        employee_id: 'uuid',
        employee_user_account_id: 234,
        employee_email: 'test@tmeil.com',
        employee_first_name: 'First',
        employee_last_name: 'Last',
        assignor_first_name: 'First2',
        assignor_last_name: 'Last2',
        assignor_display_name: 'First2 Last2',
        assignor_user_account_id: 5,
        program_id: '23',
    },
};

const taskCompletedEvent: EventModel<EmployeeAssignmentEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        company_id: 5,
        task_id: '5',
        task_title: 'title',
        employee_id: 'uuid',
        employee_user_account_id: 234,
        employee_email: 'test@tmeil.com',
        employee_first_name: 'First',
        employee_last_name: 'Last',
        assignor_first_name: 'First2',
        assignor_last_name: 'Last2',
        program_id: '23',
        assignor_display_name: 'First2 Last2',
        assignor_user_account_id: 5,
    },
};

const goalCompletedEvent: EventModel<EmployeeAssignmentEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        company_id: 5,
        goal_id: '5',
        goal_title: 'title',
        employee_id: 'uuid',
        employee_user_account_id: 234,
        employee_email: 'test@tmeil.com',
        employee_first_name: 'First',
        employee_last_name: 'Last',
        assignor_first_name: 'First2',
        assignor_last_name: 'Last2',
        program_id: '23',
        assignor_display_name: 'First2 Last2',
        assignor_user_account_id: 5,
    },
};

const goalAndTaskDueEvent: EventModel<EmployeeAssignmentEvent> = {
    event_type: 'x',
    company_id: 5,
    user_account_id: 2,
    event_id: 's',
    data: {
        employee_goals_due_count: 1,
        employee_tasks_due_count: 1,
        employee_id: 'uuid',
        employee_first_name: 'First',
        employee_last_name: 'Last',
        employee_email: 'test@tmeil.com',
        due_date: '2022-11-23',
        due_type: AssignmentDueVariableType.TODAY,
        employee_user_account_id: 2,
        company_id: 5,
    },
};

const sendManagerSubordinateEvent: EventModel<ManagerSubordinateAggregatedReportData> =
    {
        event_type:
            'talent_management_manager_weekly_subordinate_progress_report',
        event_id: 'f6935dc8-6a11-4ff0-a88d-dc0e02fcc530',
        company_id: 5,
        user_account_id: 0,
        data: {
            company_id: 5,
            company_name: 'Bitcoin Incorporation',
            company_is_live: false,
            manager_name: 'Test Invite Employee Multiple',
            manager_employee_id: 'c77021a7-cb4f-466c-9f51-b7cd73eaeecf',
            manager_first_name: 'Test Invite',
            manager_user_account_id: 13861,
            manager_email: 'testemployeemultiplecompany0001@getnada.com',
            total_action_completed: 18,
            total_action_overdue: 16,
            total_new_action: 30,
            total_goal_completed: 6,
            total_goal_overdue: 12,
            total_new_goal: 35,
            subordinates_summary: [
                {
                    employee_id: '7bda5803-31a9-47fb-8402-6c564c99b1a8',
                    name: 'camille mah',
                    overdue_count: 10,
                    new_count: 13,
                    completed_count: 5,
                },
                {
                    employee_id: '3531b7f2-2c5e-4271-996c-665f2fd9bbc5',
                    name: 'Jay Learner 2',
                    overdue_count: 8,
                    new_count: 0,
                    completed_count: 0,
                },
                {
                    employee_id: '14e2f87f-144b-4921-9808-dcedec9fcc5d',
                    name: 'Mah Yuen Tong Mah',
                    overdue_count: 3,
                    new_count: 1,
                    completed_count: 0,
                },
                {
                    employee_id: '0a4ad655-3404-4933-bb7f-7c4249f151d8',
                    name: 'Awfiyah Najib',
                    overdue_count: 2,
                    new_count: 4,
                    completed_count: 0,
                },
                {
                    employee_id: 'a274e02a-c379-4029-bc62-775ea62ac3d3',
                    name: 'Huat Employee Test',
                    overdue_count: 2,
                    new_count: 36,
                    completed_count: 0,
                },
            ],
        },
    };

const feedbackReminderEvent: EventModel<FeedbackEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        company: {
            name: 'Bitcoin Incorporation',
        },
        cycle: {
            name: 'FC Q1',
        },
        deadline: '2022-01-01',
        email_template: {
            body_in_html: '<p>Hello, this is a feedback reminder </p>',
            reply_email: 'reply',
            reply_name: 'reply',
            sender_email: 'sender',
            sender_name: 'sender',
            subject: 'Please complete your feedback',
        },
        receiver: {
            email: 'kylie.tan@gmail.com',
            first_name: 'Kylie',
            id: 'Anything',
            employee_id: 'Anything',
            last_name: 'Tan',
            user_account_id: 124,
            full_name: 'Kylie Tan',
        },
        provider: {
            email: 'changi.bay@gmail.com',
            first_name: 'Changi',
            id: 'Anything',
            employee_id: 'Anything',
            last_name: 'Bay',
            user_account_id: 128,
            full_name: 'Changi Bay',
        },
        manager: {
            email: 'boon.lay@gmail.com',
            first_name: 'Boon',
            last_name: 'Lay',
            user_account_id: 125,
            full_name: 'Boon Lay',
            employee_id: 'Anything',
        },
        url: 'https://url',
        call_to_action: {
            url: 'https://url',
        },
    },
};

const programResultReadyEvent: EventModel<ProgramEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        email: 'kylie.tan@gmail.com',
        first_name: 'Changi',
        program_name: 'Test Program',
        invite_link:
            'https://local-employee.pulsifi.me/profile/assessments/programs/1/result',
    },
};

const programInviteEvent: EventModel<ProgramEvent> = {
    event_type: 'x',
    company_id: 2,
    user_account_id: 2,
    event_id: 's',
    data: {
        email: 'kylie.tan@gmail.com',
        first_name: 'Changi',
        program_name: 'Test Program',
        company_name: 'Bitcoin Incorporation',
        invite_link: 'https://local-employee.pulsifi.me/profile/assessments',
    },
};

const companyDataResponse = {
    id: 1,
    name: 'test company',
    slug: 'test-company',
    timezone: 'Asia/Kuala_Lumpur',
    locales: [{ locale: 'en-US', is_default: true }],
};

export const testData = {
    sesMessageId1,
    emailLog1,
    sesNotification1,
    sesMessageId2,
    emailLog2,
    sesNotification2,
    sesNotification3,
    sesNotification4,
    taskAssignedEvent,
    goalAssignedEvent,
    goalAndTaskDueEvent,
    taskCompletedEvent,
    goalCompletedEvent,
    sendManagerSubordinateEvent,
    companyDataResponse,
    feedbackReminderEvent,
    programResultReadyEvent,
    programInviteEvent,
};
