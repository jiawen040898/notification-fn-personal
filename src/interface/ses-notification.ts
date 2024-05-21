// Interface extracted from here https://docs.aws.amazon.com/ses/latest/dg/event-publishing-retrieving-sns-examples.html#event-publishing-retrieving-sns-open

export interface ISESNotification {
    notificationType: NotificationType;
    mail: IMailNotification;
    bounce?: IBounceNotification;
    complaint?: IComplaintNotification;
    click?: IClickNotification;
    open?: IOpenNotification;
}

export enum NotificationType {
    BOUNCE = 'Bounce',
    COMPLAINT = 'Complaint',
    OPEN = 'Open',
    CLICK = 'Click',
}

export interface IMailNotification {
    timestamp: string;
    source: string;
    sourceArn: string;
    sourceIp: string;
    messageId: string;
}

export interface IClickNotification {
    ipAddress: string;
    link: string;
    linkTags: {
        [key: string]: string[];
    };
    timestamp: string;
    userAgent: string;
}

export interface IOpenNotification {
    ipAddress: string;
    timestamp: string;
    userAgent: string;
}

export interface IBounceNotification {
    timestamp: string;
    bounceType: string;
    bounceSubType: string;
    feedbackId: string;
    reportingMTA: string;
}

export interface IComplaintNotification {
    timestamp: string;
    feedbackId: string;
    userAgent: string;
    complaintFeedbackType: string;
}
