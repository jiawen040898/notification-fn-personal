import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import {
    EmailTemplateCommunicationType,
    EmailTemplateUsage,
} from '../constants';
import { AuditDataEntity } from './audit-data.entity';

@Entity('email_template')
export class EmailTemplate extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    company_id!: number;

    @Column({
        enum: EmailTemplateCommunicationType,
    })
    email_communication_type!: EmailTemplateCommunicationType;

    @Column({
        nullable: true,
    })
    notification_event_type?: string;

    @Column()
    subject!: string;

    @Column()
    sender_name!: string;

    @Column()
    body_in_html!: string;

    @Column()
    usage!: EmailTemplateUsage;

    @Column({
        length: 10,
    })
    language!: string;

    @Column({
        default: false,
    })
    is_deleted?: boolean;
}
