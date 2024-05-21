export enum EmailTemplateCommunicationType {
    CONSOLE_ACCOUNT_INVITATION = 'console_account_invitation', //system
    ACCOUNT_INVITATION = 'account_invitation', //system ,new user
    WELCOME_ACCOUNT = 'welcome_account', //system, existing user
    EMPLOYEE_ACCOUNT_INVITATION = 'employee_account_invitation', //system, new user
    EMPLOYEE_WELCOME_ACCOUNT = 'employee_welcome_account', //system, existing user
    DATA_DOWNLOAD_CONFIRMATION = 'data_download_confirmation', //system, for candidate data export
    APPLICATION_DOCUMENT_DOWNLOAD_CONFIRMATION = 'application_document_download_confirmation', //system, for export candidate assessment report, resume/attachment
    PROGRAM_REMINDER = 'program_reminder', //employee
    PROGRAM_INVITATION = 'program_invitation', //employee
    PROGRAM_RESULT_READY = 'program_result_ready', //employee
    APPLICATION_INVITATION = 'application_invitation', //candidate, replace job_apply_invitation
    APPLICATION_REMINDER = 'application_reminder', //candidate
    APPLICATION_SHORTLIST = 'application_shortlist', //candidate
    APPLICATION_REJECT = 'application_reject', //candidate
    ASSESSMENT_INVITATION = 'assessment_invitation', //candidate
    VIDEO_INTERVIEW_INVITATION = 'video_interview_invitation', //candidate replace video_invitation
    VIDEO_INTERVIEW_REMINDER = 'video_interview_reminder', //candidate
    EMPLOYEE_ASSIGNMENT_NOTIFICATION = 'employee_assignment_notification', // employee
    EMPLOYEE_ASSIGNMENT_REMINDER_NOTIFICATION = 'employee_assignment_reminder_notification', // employee
    EMPLOYEE_ASSIGNMENT_COMPLETION_NOTIFICATION = 'employee_assignment_completion_notification', // employee
    EMPLOYEE_ASSIGNMENT_UPDATED_NOTIFICATION = 'employee_assignment_updated_notification', // employee
    EMPLOYEE_ASSIGNMENT_DELETED_NOTIFICATION = 'employee_assignment_deleted_notification', // employee
    MANAGER_SUBORDINATE_PROGRESS_REPORT = 'manager_subordinate_progress_report', // employee

    EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED = 'employee_feedback_nomination_requested',
    MANAGER_FEEDBACK_NOMINATION_APPROVAL_REQUESTED = 'manager_feedback_nomination_approval_requested',
    EMPLOYEE_FEEDBACK_NOMINATION_SUBMISSION_REMINDER = 'employee_feedback_nomination_submission_reminder',
    MANAGER_FEEDBACK_NOMINATION_APPROVAL_REMINDER = 'manager_feedback_nomination_approval_reminder',
    EMPLOYEE_FEEDBACK_REVIEWEE_RESPONSE_SUBMISSION_REMINDER = 'employee_feedback_reviewee_response_submission_reminder',
    EMPLOYEE_FEEDBACK_REVIEWER_RESPONSE_SUBMISSION_REMINDER = 'employee_feedback_reviewer_response_submission_reminder',
    EMPLOYEE_FEEDBACK_NOMINATION_APPROVED = 'employee_feedback_nomination_approved',
    EMPLOYEE_FEEDBACK_NOMINATION_AMENDMENT_APPROVED = 'employee_feedback_nomination_amendment_approved',
    MANAGER_FEEDBACK_NOMINATION_AUTO_APPROVED = 'manager_feedback_nomination_auto_approved',
    EMPLOYEE_FEEDBACK_REVIEWEE_RESPONSE_REQUESTED = 'employee_feedback_reviewee_response_requested',
    EMPLOYEE_FEEDBACK_REVIEWER_RESPONSE_REQUESTED = 'employee_feedback_reviewer_response_requested',
    EMPLOYEE_FEEDBACK_RESULT_READY = 'employee_feedback_result_ready',
    MANAGER_FEEDBACK_RESULT_DIRECT_REPORT_READY = 'manager_feedback_result_direct_report_ready',
    EMPLOYEE_FEEDBACK_NOMINATION_ADMIN_AMENDMENT = 'employee_feedback_nomination_admin_amendment',
    MANAGER_FEEDBACK_NOMINATION_ADMIN_AMENDMENT = 'manager_feedback_nomination_admin_amendment',
    EMPLOYEE_FEEDBACK_RECOMMENDATION_READY = 'employee_feedback_recommendation_ready',
}

export enum EmailTemplateUsage {
    SYSTEM = 'system',
    DEFAULT = 'default',
    CLIENT = 'client',
}

export const eventToEmailTemplate = {
    talent_management_task_assigned: [
        EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_NOTIFICATION,
    ],
    talent_management_goal_assigned: [
        EmailTemplateCommunicationType.EMPLOYEE_ASSIGNMENT_NOTIFICATION,
    ],
};
