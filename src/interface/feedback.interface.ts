export interface Company {
    name: string;
}
export interface FeedbackCycle {
    name: string;
}
export interface Receiver {
    id: string;
    employee_id: string;
    user_account_id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
}

export interface Provider {
    id: string;
    employee_id: string;
    user_account_id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
}

export interface Manager {
    employee_id: string;
    user_account_id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
}

export interface EmailTemplate {
    subject: string;
    body_in_html: string;
    sender_email: string;
    sender_name: string;
    reply_email: string;
    reply_name: string;
}

export interface CallToAction {
    url: string;
}

interface EmailSender {
    name: string;
    email?: string;
}

export interface BasicFeedbackEvent {
    company: Company;
    receiver: Receiver;
    call_to_action: CallToAction;
    email_sender?: EmailSender;
}

export interface FeedbackEvent {
    company: Company;
    cycle: FeedbackCycle;
    receiver: Receiver;
    provider: Provider;
    manager: Manager;
    deadline: string;
    url: string;
    email_template: EmailTemplate;
    call_to_action: CallToAction;
}
