import { envUtil } from '@pulsifi/fn';

export const ses = () => ({
    region: process.env.SES_REGION || 'us-west-2',
    apiVersion: '2019-09-27',
    configurationSetName: 'tracking', // set in AWS console
});

export const emailSqs = () => ({
    region: envUtil.get('REGION'),
    apiVersion: '2012-11-05',
    emailRequestQueue: envUtil.get('NOTIFICATION_EMAIL_REQUEST_QUEUE_URL'),
});

export const pushNotificationSqs = () => ({
    region: envUtil.get('REGION'),
    apiVersion: '2012-11-05',
    pushNotificationQueue: envUtil.get('PUSH_NOTIFICATION_REQUEST_QUEUE_URL'),
});

export const alb = () => ({
    dns: envUtil.get('AWS_ALB_DNS'),
});

export const pulsifi = () => ({
    employeeAppUrl: envUtil.get('EMPLOYEE_APP_URL'),
    senderEmail: envUtil.get('SENDER_EMAIL'),
});
