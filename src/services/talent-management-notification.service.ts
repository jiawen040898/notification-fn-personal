import {
    cacheService,
    dateTimeUtil,
    EventModel,
    generatorUtil,
    stringUtil,
} from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import * as AWSConfig from '../configs';
import {
    AppActivityType,
    AssignmentDueVariableType,
    CacheObject,
    EmailTemplateCommunicationType,
    IconType,
} from '../constants';
import {
    BasicFeedbackEvent,
    EmployeeAssignmentEvent,
    FeedbackEvent,
    ITemplateVariable,
    ManagerSubordinateAggregatedReportData,
    ProgramEvent,
} from '../interface';
import { AppActivityMessage } from '../models';
import {
    EmailNotificationService,
    IdentityService,
    PushNotificationService,
} from '.';

export class TalentManagementNotificationService {
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

    async notifyTaskAssigned(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        const taskAssignedPayload = message.data;

        let type = AppActivityType.EMPLOYEE_TASK_ASSIGNED;
        let icon = IconType.TASK;
        if (taskAssignedPayload.learning_course_id) {
            type = AppActivityType.EMPLOYEE_COURSE_ASSIGNED;
            icon = IconType.COURSE;
        }

        await this.sendPushNotification(
            taskAssignedPayload.company_id,
            taskAssignedPayload.employee_user_account_id,
            type,
            icon,
            taskAssignedPayload.assignor_user_account_id!,
            taskAssignedPayload,
        );
        await this.sendEmailEmployeeAssignmentEventNotification(
            taskAssignedPayload,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_NOTIFICATION,
        );
    }

    async notifyGoalAssigned(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        const goalAssignedPayload = message.data;

        await this.sendPushNotification(
            goalAssignedPayload.company_id,
            goalAssignedPayload.employee_user_account_id,
            AppActivityType.EMPLOYEE_GOAL_ASSIGNED,
            IconType.GOAL,
            goalAssignedPayload.assignor_user_account_id!,
            goalAssignedPayload,
        );
        await this.sendEmailEmployeeAssignmentEventNotification(
            goalAssignedPayload,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_NOTIFICATION,
        );
    }

    async notifyGoalAndTaskDue(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        const assignmentDuePayload = message.data;

        const type =
            assignmentDuePayload.due_type ===
            AssignmentDueVariableType.IN_3_DAYS
                ? AppActivityType.EMPLOYEE_ASSIGNMENT_DUE
                : AppActivityType.EMPLOYEE_ASSIGNMENT_OVERDUE;

        await this.sendPushNotification(
            assignmentDuePayload.company_id,
            assignmentDuePayload.employee_user_account_id,
            type,
            IconType.ALERT,
            assignmentDuePayload.employee_user_account_id,
            assignmentDuePayload,
        );
        await this.sendEmailEmployeeAssignmentEventNotification(
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_REMINDER_NOTIFICATION,
        );
    }

    async notifyTaskCompleted(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        let type = AppActivityType.EMPLOYEE_TASK_MARK_COMPLETED;
        let icon = IconType.TASK;
        if (message.data.learning_course_id) {
            type = AppActivityType.EMPLOYEE_COURSE_MARK_COMPLETED;
            icon = IconType.COURSE;
        }

        await this.sendPushNotification(
            message.data.company_id,
            message.data.employee_user_account_id,
            type,
            icon,
            message.data.assignor_user_account_id!,
            message.data,
        );

        return this.sendEmailEmployeeAssignmentEventNotification(
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_COMPLETION_NOTIFICATION,
        );
    }

    async notifyGoalCompleted(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.data.company_id,
            message.data.employee_user_account_id,
            AppActivityType.EMPLOYEE_GOAL_MARK_COMPLETED,
            IconType.GOAL,
            message.data.assignor_user_account_id!,
            message.data,
        );

        return this.sendEmailEmployeeAssignmentEventNotification(
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_COMPLETION_NOTIFICATION,
        );
    }

    async notifyTaskUpdated(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        const payload = message.data;
        let type = AppActivityType.EMPLOYEE_TASK_UPDATED;
        let subordinateType = AppActivityType.SUBORDINATE_TASK_UPDATED;
        let icon = IconType.TASK;
        if (payload.learning_course_id) {
            type = AppActivityType.EMPLOYEE_COURSE_UPDATED;
            subordinateType = AppActivityType.SUBORDINATE_COURSE_UPDATED;
            icon = IconType.COURSE;
        }

        await this.sendPushNotification(
            payload.company_id,
            payload.employee_user_account_id,
            type,
            icon,
            payload.assignor_user_account_id!,
            payload,
        );

        if (
            payload.manager_user_account_id &&
            payload.manager_user_account_id !== payload.assignor_user_account_id
        ) {
            await this.sendPushNotification(
                payload.company_id,
                payload.manager_user_account_id,
                subordinateType,
                icon,
                payload.assignor_user_account_id!,
                payload,
            );
        }

        return this.sendEmailEmployeeAssignmentEventNotification(
            payload,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_UPDATED_NOTIFICATION,
        );
    }

    async notifyGoalUpdated(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        const payload = message.data;

        await this.sendPushNotification(
            payload.company_id,
            payload.employee_user_account_id,
            AppActivityType.EMPLOYEE_GOAL_UPDATED,
            IconType.GOAL,
            payload.employee_user_account_id,
            payload,
        );

        if (
            payload.manager_user_account_id &&
            payload.manager_user_account_id !== payload.assignor_user_account_id
        ) {
            await this.sendPushNotification(
                payload.company_id,
                payload.manager_user_account_id,
                AppActivityType.SUBORDINATE_GOAL_UPDATED,
                IconType.GOAL,
                payload.assignor_user_account_id!,
                payload,
            );
        }

        return this.sendEmailEmployeeAssignmentEventNotification(
            payload,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_UPDATED_NOTIFICATION,
        );
    }

    async notifyTaskDeleted(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        let type = AppActivityType.EMPLOYEE_TASK_DELETED;
        let icon = IconType.TASK;
        if (message.data.learning_course_id) {
            type = AppActivityType.EMPLOYEE_COURSE_DELETED;
            icon = IconType.COURSE;
        }

        await this.sendPushNotification(
            message.data.company_id,
            message.data.employee_user_account_id,
            type,
            icon,
            message.data.assignor_user_account_id!,
            message.data,
        );

        return this.sendEmailEmployeeAssignmentEventNotification(
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_DELETED_NOTIFICATION,
        );
    }

    async notifyGoalDeleted(
        message: EventModel<EmployeeAssignmentEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.data.company_id,
            message.data.employee_user_account_id,
            AppActivityType.EMPLOYEE_GOAL_DELETED,
            IconType.GOAL,
            message.data.assignor_user_account_id!,
            message.data,
        );

        return this.sendEmailEmployeeAssignmentEventNotification(
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_DELETED_NOTIFICATION,
        );
    }

    async notifyFeedbackNominationRequest(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED,
        );
    }

    async notifyFeedbackManagerNominationApprovalRequest(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.MANAGER_FEEDBACK_NOMINATION_APPROVAL_REQUESTED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.manager.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.MANAGER_FEEDBACK_NOMINATION_APPROVAL_REQUESTED,
        );
    }

    async notifyFeedbackNominationSubmissionDue(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_NOMINATION_SUBMISSION_DUE,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_SUBMISSION_REMINDER,
        );
    }

    async notifyFeedbackManagerNominationApprovalDue(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.MANAGER_FEEDBACK_NOMINATION_APPROVAL_DUE,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.manager.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.MANAGER_FEEDBACK_NOMINATION_APPROVAL_REMINDER,
        );
    }

    async notifyFeedbackRevieweeResponseSubmissionDue(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_REVIEWEE_SUBMISSION_DUE,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.provider.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_REVIEWEE_RESPONSE_SUBMISSION_REMINDER,
        );
    }

    async notifyFeedbackReviewerResponseSubmissionDue(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_REVIEWER_SUBMISSION_DUE,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.provider.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_REVIEWER_RESPONSE_SUBMISSION_REMINDER,
        );
    }

    async notifyFeedbackNominationApproved(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_NOMINATION_APPROVED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_APPROVED,
        );
    }

    async notifyFeedbackNominationAmendmentApproved(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_NOMINATION_AMENDMENT_APPROVED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_AMENDMENT_APPROVED,
        );
    }

    async notifyFeedbackManagerNominationAutoApproved(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.MANAGER_FEEDBACK_NOMINATION_AUTO_APPROVED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.manager.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.MANAGER_FEEDBACK_NOMINATION_AUTO_APPROVED,
        );
    }

    async notifyFeedbackReviewerResponseReady(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_REVIEWER_RESPONSE_REQUESTED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.provider.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_REVIEWER_RESPONSE_REQUESTED,
        );
    }

    async notifyFeedbackRevieweeResponseReady(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_REVIEWEE_RESPONSE_REQUESTED,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.provider.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_REVIEWEE_RESPONSE_REQUESTED,
        );
    }

    async notifyFeedbackRevieweeResultReady(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_RESULT_READY,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_RESULT_READY,
        );
    }

    async notifyFeedbackManagerDirectReportResultReady(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.MANAGER_FEEDBACK_RESULT_DIRECT_REPORT_READY,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.manager.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.MANAGER_FEEDBACK_RESULT_DIRECT_REPORT_READY,
        );
    }

    async notifyFeedbackNominationAdminAmendment(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_NOMINATION_ADMIN_AMENDMENT,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_NOMINATION_ADMIN_AMENDMENT,
        );
    }

    async notifyEmployeeFeedbackRecommendationCompleted(
        message: EventModel<BasicFeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_FEEDBACK_RECOMMENDATION_READY,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailEventNotification(
            message.company_id,
            message.data.receiver.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.EMPLOYEE_FEEDBACK_RECOMMENDATION_READY,
        );
    }

    async notifyFeedbackManagerNominationAdminAmendment(
        message: EventModel<FeedbackEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.MANAGER_FEEDBACK_NOMINATION_ADMIN_AMENDMENT,
            IconType.FEEDBACK,
            message.user_account_id,
            message.data,
            message.data.call_to_action.url,
        );

        return this.sendEmailFeedbackEventNotification(
            message.company_id,
            message.data.manager.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.MANAGER_FEEDBACK_NOMINATION_ADMIN_AMENDMENT,
        );
    }

    async sendManagerSubordinateProgressReport(
        message: EventModel<ManagerSubordinateAggregatedReportData>,
    ): Promise<void> {
        const report = message.data;

        report.subordinates_summary?.forEach((subordinate) => {
            subordinate.initial = stringUtil.getInitialFromName(
                subordinate.name,
            );
        });

        const emailRequest = this.emailNotificationService.prepareEmailRequest(
            message.company_id,
            message.data.manager_user_account_id,
            message.data.manager_email,
            EmailTemplateCommunicationType.MANAGER_SUBORDINATE_PROGRESS_REPORT,
            {
                ...report,
                today_date: dateTimeUtil.formatDate(dateTimeUtil.now()),
                one_week_ago_date: dateTimeUtil.formatDate(
                    dateTimeUtil.addDays(-7),
                ),
                employee_app_url: AWSConfig.pulsifi().employeeAppUrl,
            },
        );
        return this.emailNotificationService.sendEmailRequestMessage(
            emailRequest,
        );
    }

    async notifyParticipantProgramResultReady(
        message: EventModel<ProgramEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_PROGRAM_RESULT_READY,
            IconType.PROGRAM,
            message.user_account_id,
            message.data,
            message.data.invite_link,
        );

        return this.sendEmailEventNotification(
            message.company_id,
            message.data.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.PROGRAM_RESULT_READY,
        );
    }

    async notifyParticipantProgramInvitation(
        message: EventModel<ProgramEvent>,
    ): Promise<void> {
        await this.sendPushNotification(
            message.company_id,
            message.user_account_id,
            AppActivityType.EMPLOYEE_PROGRAM_INVITATION,
            IconType.PROGRAM,
            message.user_account_id,
            message.data,
            message.data.invite_link,
        );

        return this.sendEmailEventNotification(
            message.company_id,
            message.data.email,
            message.user_account_id,
            message.data,
            EmailTemplateCommunicationType.PROGRAM_INVITATION,
        );
    }

    private sendEmailEmployeeAssignmentEventNotification(
        payload: EmployeeAssignmentEvent,
        emailCommunicationType: EmailTemplateCommunicationType,
    ): Promise<void> {
        const emailRequest = this.emailNotificationService.prepareEmailRequest(
            payload.company_id,
            payload.employee_user_account_id,
            payload.employee_email,
            emailCommunicationType,
            {
                ...payload,
                login_link: AWSConfig.pulsifi().employeeAppUrl,
            },
        );
        return this.emailNotificationService.sendEmailRequestMessage(
            emailRequest,
        );
    }

    private sendEmailFeedbackEventNotification(
        companyId: number,
        recipientEmail: string,
        recipientId: number,
        payload: FeedbackEvent,
        emailCommunicationType: EmailTemplateCommunicationType,
    ): Promise<void> {
        const emailRequest = this.emailNotificationService.prepareEmailRequest(
            companyId,
            recipientId,
            recipientEmail,
            emailCommunicationType,
            payload,
            payload.email_template,
        );

        return this.emailNotificationService.sendEmailRequestMessage(
            emailRequest,
        );
    }

    private sendEmailEventNotification(
        companyId: number,
        recipientEmail: string,
        recipientId: number,
        payload: Partial<ITemplateVariable>,
        emailCommunicationType: EmailTemplateCommunicationType,
    ): Promise<void> {
        const emailRequest = this.emailNotificationService.prepareEmailRequest(
            companyId,
            recipientId,
            recipientEmail,
            emailCommunicationType,
            payload,
        );

        return this.emailNotificationService.sendEmailRequestMessage(
            emailRequest,
        );
    }

    private async clearNotificationCache(userAccountId: number): Promise<void> {
        const cacheKey = generatorUtil.cacheKey(
            CacheObject.APP_ACTIVITY_MESSAGE,
            CacheObject.USER_ACCOUNT_ID,
            userAccountId,
        );

        await cacheService.del(cacheKey);
    }

    private async sendPushNotification(
        companyId: number,
        userAccountId: number,
        appActivityType: AppActivityType,
        icon: IconType,
        createdBy: number,
        variables: Partial<ITemplateVariable>,
        linkUrl?: string,
    ): Promise<void> {
        if (userAccountId > 0) {
            await this.saveAppActivityMessage(
                companyId,
                userAccountId,
                appActivityType,
                icon,
                createdBy,
                variables,
                linkUrl,
            );

            const pushNotificationRequest =
                this.pushNotificationService.preparePushNotificationRequest(
                    companyId,
                    userAccountId,
                    appActivityType,
                    icon,
                    createdBy,
                    variables,
                );

            await this.pushNotificationService.sendPushNotificationRequestMessage(
                pushNotificationRequest,
            );

            await this.clearNotificationCache(userAccountId);
        }
    }

    private async saveAppActivityMessage(
        companyId: number,
        userAccountId: number,
        messageCategory: AppActivityType,
        icon: IconType,
        createdBy: number,
        assignedPayload: Partial<ITemplateVariable>,
        linkUrl?: string,
    ): Promise<void> {
        const newAppActivityMessage: Partial<AppActivityMessage> = {
            company_id: companyId,
            user_account_id: userAccountId,
            icon: icon,
            message_category: messageCategory,
            value: assignedPayload,
            link_url: linkUrl,
            is_read: false,
            created_by: createdBy,
            updated_by: createdBy,
        };

        await this.dataSource
            .getRepository(AppActivityMessage)
            .save(newAppActivityMessage, { reload: false });
    }
}
