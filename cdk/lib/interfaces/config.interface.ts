export type CommonCDKEnvironmentVariables = {
    NODE_ENV: string;
    SENTRY_DSN: string;
    SERVERLESS_STAGE: string;
    SM_NAME: string;
    REDIS_SM_NAME: string;
    REGION: string;
    EMPLOYEE_APP_URL: string;
    AWS_ALB_DNS: string;
    SENDER_EMAIL: string;
};

export type NotificationProcessEventMessageNotificationFnConfig = {
    NOTIFICATION_EMAIL_REQUEST_QUEUE_URL: string;
    PUSH_NOTIFICATION_REQUEST_QUEUE_URL: string;
};

export type NotificationSendEmailFnConfig = {
    SES_REGION: string;
};

export type NotificationPushNotificationFnConfig = {
    PUSHER_SM_NAME: string;
};
