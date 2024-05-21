import { AssignmentDueVariableType } from '../constants';
import {
    Company,
    FeedbackCycle,
    Manager,
    Provider,
    Receiver,
} from './feedback.interface';
import { SubordinatesProgressData } from './manager-subordinate-aggregated-report-data.interface';

export interface IEmailTemplate {
    id?: number;
    subject: string;
    body_in_html: string;
}
export interface IEmailRequest {
    recipient_email: string;
    recipient_id?: string;
    recipient_group: string; //candidate, user
    company_id?: number;
    email_template_id?: number;
    email_communication_type?: string;
    variables: Partial<ITemplateVariable>;
    email_template?: IEmailTemplate;
}

export interface ITemplateVariable {
    sender_name?: string;
    first_name?: string;
    last_name?: string;
    job_title?: string;
    company_name?: string;
    company_id?: number;
    download_link?: string;
    invite_link?: string;
    set_password_link?: string;
    login_password?: string; //obsolete, to be replace by set_password_link
    program_name?: string;
    login_link?: string;
    file_name?: string;
    today_date?: string;
    one_week_ago_date?: string;

    // employee related
    employee_app_url?: string;
    employee_id?: string;
    employee_user_account_id?: number;
    employee_email?: string;
    employee_first_name?: string;
    employee_last_name?: string;
    assignor_user_account_id?: number;
    assignor_first_name?: string;
    assignor_last_name?: string;
    assignor_display_name?: string;
    goal_id?: string;
    goal_title?: string;
    task_id?: string;
    task_title?: string;
    learning_course_id?: string;
    program_id?: string;
    due_date?: string;
    due_type?: AssignmentDueVariableType;
    employee_goals_due_count?: number;
    employee_tasks_due_count?: number;
    manager_employee_id?: string;
    manager_user_account_id?: number;
    manager_name?: string;
    manager_email?: string;
    manager_first_name?: string;
    total_action_completed?: number;
    total_action_overdue?: number;
    total_new_action?: number;
    total_goal_completed?: number;
    total_goal_overdue?: number;
    total_new_goal?: number;
    subordinates_summary?: SubordinatesProgressData[];

    // Feedback Cycle - start
    deadline?: string;
    url?: string;
    provider?: Provider;
    receiver?: Receiver;
    manager?: Manager;
    cycle?: FeedbackCycle;
    company?: Company;

    // Feedback Cycle - end
}
