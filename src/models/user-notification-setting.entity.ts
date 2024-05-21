import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';

@Entity('user_notification_setting')
export class UserNotificationSetting extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    company_id!: number;

    @Column()
    user_account_id!: number;

    @Column()
    notification_event_type!: string;

    @Column()
    is_email_notification_enabled?: boolean;

    @Column()
    is_app_notification_enabled?: boolean;

    @Column({
        default: false,
    })
    is_deleted?: boolean;
}
