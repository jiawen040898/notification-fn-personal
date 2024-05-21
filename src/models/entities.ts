import { AppActivityMessage } from './app-activity-message.entity';
import { AppMessageTemplate } from './app-message-template.entity';
import { EmailActivityMessage } from './email-activity-message.entity';
import { EmailTemplate } from './email-template.entity';
import { UserNotificationSetting } from './user-notification-setting.entity';

export const ENTITIES = [
    AppMessageTemplate,
    EmailActivityMessage,
    EmailTemplate,
    AppActivityMessage,
    UserNotificationSetting,
];
