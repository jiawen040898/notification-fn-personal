import { AssignmentDueVariableType } from '../constants';

export interface ApplicationWithdraw {
    company_id: number;
    job_application_id: string;
    job_id: string;
    job_title: string;
    withdrawn_reason: string;
    withdrawn_at: Date;
}

export interface CompanyCreated {
    company_id: number;
    company_name: string;
}

export interface EmployeeAssignmentEvent {
    company_id: number;
    company_name?: string;
    task_id?: string;
    task_title?: string;
    goal_id?: string;
    goal_title?: string;
    employee_id: string;
    employee_user_account_id: number;
    employee_email: string;
    employee_first_name: string;
    employee_last_name: string;
    manager_user_account_id?: number;
    assignor_user_account_id?: number;
    assignor_first_name?: string;
    assignor_last_name?: string;
    assignor_display_name?: string;
    learning_course_id?: string;
    program_id?: string;
    due_date?: string;
    employee_goals_due_count?: number;
    employee_tasks_due_count?: number;
    due_type?: AssignmentDueVariableType;
}
