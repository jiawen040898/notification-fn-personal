import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';

export enum EmailActivityMessageFailureCode {
    PARSER_ERROR = 'parser_error',
    API_ERROR = 'api_error',
    BOUNCED = 'bounced',
}

export enum EmailActivityMessageDeliveryStatus {
    SENT = 'sent',
    FAILED = 'failed',
    NOT_SENT = 'not_sent',
    BOUNCED = 'bounced',
}

export enum EmailActivityMessageRecipientGroup {
    CANDIDATE = 'candidate',
    USER = 'user',
    EMPLOYEE = 'employee',
}

@Entity('email_activity_message')
export class EmailActivityMessage extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    company_id!: number;

    @Column({
        nullable: true,
    })
    email_template_id?: number;

    @Column()
    email_communication_type!: string;

    @Column({
        enum: EmailActivityMessageDeliveryStatus,
    })
    delivery_status!: string;

    @Column({
        nullable: true,
    })
    recipient_id?: string;

    @Column()
    recipient_email!: string;

    @Column()
    recipient_group!: string;

    @Column()
    subject!: string;

    @Column()
    sender_name!: string;

    @Column()
    sender_email!: string;

    @Column('simple-json', {
        nullable: true,
    })
    body_variables!: JSON;

    @Column()
    body_in_html!: string;

    @Column({
        nullable: true,
    })
    ext_ses_message_id?: string;

    @Column({
        nullable: true,
    })
    failure_reason_code?: string;

    @Column('simple-json', {
        nullable: true,
    })
    failure_detail?: JSON;

    @Column('simple-json', {
        nullable: true,
    })
    complaint_detail?: JSON;

    @Column({
        default: 0,
    })
    open_count!: number;

    @Column('simple-json', {
        nullable: true,
    })
    open_detail?: JSON;

    @Column({
        default: 0,
    })
    click_count!: number;

    @Column('simple-json', {
        nullable: true,
    })
    click_detail?: JSON;

    @Column({
        default: false,
    })
    is_deleted?: boolean;

    @Column({
        nullable: true,
    })
    sent_at?: Date;
}
