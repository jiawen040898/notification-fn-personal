import { EventModel, logger, sqsRecordUtil } from '@pulsifi/fn';
import { Handler, SQSEvent } from 'aws-lambda';
import { DataSource } from 'typeorm';

import { EventType } from '../constants';
import { getDataSource } from '../database';
import {
    BasicFeedbackEvent,
    CompanyCreated,
    EmployeeAssignmentEvent,
    FeedbackEvent,
    ManagerSubordinateAggregatedReportData,
    ProgramEvent,
} from '../interface';
import { eventMiddleware } from '../middleware';
import {
    AppNotificationService,
    CompanyEmailTemplateService,
    TalentManagementNotificationService,
} from '../services';

type EventTypeHandler = {
    [K in EventType]: (
        dataSource: DataSource,
        message: EventModel<SafeAny>,
    ) => Promise<void>;
};

export const eventHandlers: EventTypeHandler = {
    [EventType.COMPANY_CREATED]: (
        dataSource: DataSource,
        message: EventModel<CompanyCreated>,
    ): Promise<void> => {
        const eventHandler = new CompanyEmailTemplateService(dataSource);
        return eventHandler.setupEmailTemplate(message);
    },

    [EventType.APPLICATION_WITHDRAW]: (
        dataSource: DataSource,
        message: EventModel<JSON>,
    ): Promise<void> => {
        const eventHandler = new AppNotificationService(dataSource);
        return eventHandler.notifyApplicationWithdraw(message);
    },

    [EventType.TALENT_MANAGEMENT_TASK_ASSIGNED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyTaskAssigned(message);
    },

    [EventType.TALENT_MANAGEMENT_GOAL_ASSIGNED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyGoalAssigned(message);
    },

    [EventType.TALENT_MANAGEMENT_EMPLOYEE_REMINDER]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyGoalAndTaskDue(message);
    },

    [EventType.TALENT_MANAGEMENT_TASK_COMPLETED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyTaskCompleted(message);
    },

    [EventType.TALENT_MANAGEMENT_GOAL_COMPLETED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyGoalCompleted(message);
    },

    [EventType.TALENT_MANAGEMENT_TASK_UPDATED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyTaskUpdated(message);
    },

    [EventType.TALENT_MANAGEMENT_GOAL_UPDATED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyGoalUpdated(message);
    },

    [EventType.TALENT_MANAGEMENT_TASK_DELETED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyTaskDeleted(message);
    },

    [EventType.TALENT_MANAGEMENT_GOAL_DELETED]: (
        dataSource: DataSource,
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyGoalDeleted(message);
    },

    [EventType.MANAGER_WEEKLY_SUBORDINATE_PROGRESS_REPORT]: (
        dataSource: DataSource,
        message: EventModel<ManagerSubordinateAggregatedReportData>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.sendManagerSubordinateProgressReport(message);
    },
    [EventType.FEEDBACK_NOMINATION_SUBMISSION_DUE]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackNominationSubmissionDue(message);
    },
    [EventType.FEEDBACK_MANAGER_NOMINATION_APPROVAL_DUE]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackManagerNominationApprovalDue(message);
    },
    [EventType.FEEDBACK_REVIEWEE_RESPONSE_SUBMISSION_DUE]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackRevieweeResponseSubmissionDue(
            message,
        );
    },
    [EventType.FEEDBACK_REVIEWER_RESPONSE_SUBMISSION_DUE]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackReviewerResponseSubmissionDue(
            message,
        );
    },
    [EventType.FEEDBACK_MANAGER_NOMINATION_AUTO_APPROVED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackManagerNominationAutoApproved(
            message,
        );
    },

    [EventType.FEEDBACK_NOMINATION_APPROVED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackNominationApproved(message);
    },
    [EventType.FEEDBACK_NOMINATION_AMENDMENT_APPROVED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackNominationAmendmentApproved(message);
    },

    [EventType.FEEDBACK_REVIEWEE_RESPONSE_REQUESTED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackRevieweeResponseReady(message);
    },

    [EventType.FEEDBACK_REVIEWER_RESPONSE_REQUESTED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackReviewerResponseReady(message);
    },
    [EventType.FEEDBACK_REVIEWEE_RESULT_READY]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackRevieweeResultReady(message);
    },
    [EventType.FEEDBACK_MANAGER_DIRECT_REPORT_RESULT_READY]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackManagerDirectReportResultReady(
            message,
        );
    },
    [EventType.EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackNominationRequest(message);
    },
    [EventType.MANAGER_FEEDBACK_NOMINATION_APPROVAL_REQUESTED]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackManagerNominationApprovalRequest(
            message,
        );
    },
    [EventType.FEEDBACK_NOMINATION_ADMIN_AMENDMENT]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackNominationAdminAmendment(message);
    },
    [EventType.FEEDBACK_REVIEWEE_FEEDBACK_RECOMMENDATION_COMPLETED]: (
        dataSource: DataSource,
        message: EventModel<BasicFeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyEmployeeFeedbackRecommendationCompleted(
            message,
        );
    },
    [EventType.FEEDBACK_MANAGER_NOMINATION_ADMIN_AMENDMENT]: (
        dataSource: DataSource,
        message: EventModel<FeedbackEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyFeedbackManagerNominationAdminAmendment(
            message,
        );
    },
    [EventType.PARTICIPANT_PROGRAM_INVITATION]: (
        dataSource: DataSource,
        message: EventModel<ProgramEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyParticipantProgramInvitation(message);
    },
    [EventType.PARTICIPANT_PROGRAM_RESULT_READY]: (
        dataSource: DataSource,
        message: EventModel<ProgramEvent>,
    ): Promise<void> => {
        const eventHandler = new TalentManagementNotificationService(
            dataSource,
        );
        return eventHandler.notifyParticipantProgramResultReady(message);
    },
};

const handleEvent: Handler = async (event: SQSEvent) => {
    const dataSource: DataSource = await getDataSource();

    for (const record of event.Records) {
        const message =
            sqsRecordUtil.parseBodyMessage<EventModel<JSON>>(record);

        const messageEventType = message.event_type.toLowerCase() as EventType;

        if (!eventHandlers[messageEventType]) {
            logger.info('Not processing any event');
            return;
        }

        await eventHandlers[messageEventType](dataSource, message);
    }
};

export const handler = eventMiddleware(handleEvent);
