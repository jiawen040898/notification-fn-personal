import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';

@Entity('app_message_template')
export class AppMessageTemplate extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    notification_event_type!: string;

    @Column()
    language!: string;

    @Column({
        default: 0,
    })
    priority!: number;

    @Column()
    message_category!: string;

    @Column()
    title!: string;

    @Column()
    body!: string;

    @Column()
    body_in_html!: string;

    @Column()
    link_url?: string;

    @Column()
    link_text?: string;

    @Column({
        default: false,
    })
    is_deleted?: boolean;
}
