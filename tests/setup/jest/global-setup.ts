const global = () => {
    process.env.TZ = 'UTC';
    process.env.REGION = 'ap-southeast-1';
    process.env.SENTRY_DSN = 'https://test.pulsifi.me/sentry';
    process.env.SERVERLESS_STAGE = 'test';
    process.env.AWS_SESSION_TOKEN = 'the-token';
    process.env.NOTIFICATION_EMAIL_REQUEST_QUEUE_URL =
        'https://test.pulsifi.me/queue/notitication/email';
    process.env.PUSH_NOTIFICATION_REQUEST_QUEUE_URL =
        'https://test.pulsifi.me/queue/notification/push';
    process.env.AWS_ALB_DNS = 'https://alb.test.pulsifi.me';
    process.env.EMPLOYEE_APP_URL = 'https://local-employee.pulsifi.me';
    process.env.SENDER_EMAIL = 'no-reply@pulsifi.me';
};

export default global;
