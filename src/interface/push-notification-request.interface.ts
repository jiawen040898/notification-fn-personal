import { AppActivityType, IconType } from '../constants';
import { ITemplateVariable } from './email-request';

export interface IPushNotificationRequest {
    company_id: number;
    user_account_id: number;
    created_by: number;
    message_category: AppActivityType;
    icon: IconType;
    variables?: ITemplateVariable;
}
