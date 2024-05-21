/* eslint-disable @typescript-eslint/naming-convention */
import { Functions } from 'serverless/aws';

import { handleBounceNotification } from './handle-bounce-notification-fn';
import { handleNotificationMetric } from './handle-notification-metric-fn';
import { processEventMessageNotification } from './process-event-message-notification-fn';
import { sendEmail } from './send-email-fn';
import { sendPushNotification } from './send-push-notification-fn';

export const functions: Functions = {
    sendEmail,
    sendPushNotification,
    processEventMessageNotification,
    handleBounceNotification,
    handleNotificationMetric,
};
