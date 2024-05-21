export enum EventType {
    COMPANY_CREATED = 'company_created',
    APPLICATION_WITHDRAW = 'application_withdraw',
    TALENT_MANAGEMENT_TASK_ASSIGNED = 'talent_management_task_assigned',
    TALENT_MANAGEMENT_GOAL_ASSIGNED = 'talent_management_goal_assigned',
    TALENT_MANAGEMENT_GOAL_COMPLETED = 'talent_management_goal_completed',
    TALENT_MANAGEMENT_TASK_COMPLETED = 'talent_management_task_completed',
    TALENT_MANAGEMENT_GOAL_UPDATED = 'talent_management_goal_updated',
    TALENT_MANAGEMENT_TASK_UPDATED = 'talent_management_task_updated',
    TALENT_MANAGEMENT_GOAL_DELETED = 'talent_management_goal_deleted',
    TALENT_MANAGEMENT_TASK_DELETED = 'talent_management_task_deleted',
    TALENT_MANAGEMENT_EMPLOYEE_REMINDER = 'talent_management_employee_reminder',
    MANAGER_WEEKLY_SUBORDINATE_PROGRESS_REPORT = 'talent_management_manager_weekly_subordinate_progress_report',
    EMPLOYEE_FEEDBACK_NOMINATION_REQUESTED = 'talent_management_feedback_nomination_requested',
    MANAGER_FEEDBACK_NOMINATION_APPROVAL_REQUESTED = 'talent_management_feedback_manager_nomination_approval_requested',
    FEEDBACK_NOMINATION_SUBMISSION_DUE = 'talent_management_feedback_nomination_submission_due',
    FEEDBACK_MANAGER_NOMINATION_APPROVAL_DUE = 'talent_management_feedback_manager_nomination_approval_due',
    FEEDBACK_REVIEWEE_RESPONSE_SUBMISSION_DUE = 'talent_management_feedback_reviewee_response_submission_due',
    FEEDBACK_REVIEWER_RESPONSE_SUBMISSION_DUE = 'talent_management_feedback_reviewer_response_submission_due',
    FEEDBACK_NOMINATION_AMENDMENT_APPROVED = 'talent_management_feedback_nomination_amendment_approved',
    FEEDBACK_NOMINATION_ADMIN_AMENDMENT = 'talent_management_feedback_nomination_admin_amendment',
    FEEDBACK_NOMINATION_APPROVED = 'talent_management_feedback_nomination_approved',
    FEEDBACK_MANAGER_NOMINATION_AUTO_APPROVED = 'talent_management_feedback_manager_nomination_auto_approved',
    FEEDBACK_MANAGER_NOMINATION_ADMIN_AMENDMENT = 'talent_management_feedback_manager_nomination_admin_amendment',
    FEEDBACK_REVIEWEE_RESPONSE_REQUESTED = 'talent_management_feedback_reviewee_response_requested',
    FEEDBACK_REVIEWER_RESPONSE_REQUESTED = 'talent_management_feedback_reviewer_response_requested',
    FEEDBACK_REVIEWEE_RESULT_READY = 'talent_management_feedback_reviewee_result_ready',
    FEEDBACK_MANAGER_DIRECT_REPORT_RESULT_READY = 'talent_management_feedback_manager_direct_report_result_ready',
    FEEDBACK_REVIEWEE_FEEDBACK_RECOMMENDATION_COMPLETED = 'talent_management_feedback_reviewee_recommendation_completed',
    PARTICIPANT_PROGRAM_INVITATION = 'talent_management_employee_program_invitation',
    PARTICIPANT_PROGRAM_RESULT_READY = 'talent_management_employee_program_result_ready',
}