import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IconType } from '../constants';
import { ITemplateVariable } from '../interface';
import { AuditDataEntity } from './audit-data.entity';

@Entity('app_activity_message')
export class AppActivityMessage extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    company_id!: number;

    @Column()
    user_account_id!: number;

    @Column({
        enum: IconType,
        type: 'varchar',
        length: 50,
    })
    icon!: IconType;

    @Column()
    message_category!: string;

    @Column('simple-json')
    value!: ITemplateVariable;

    @Column({
        length: 2000,
        nullable: true,
    })
    link_url?: string;

    @Column({
        default: false,
    })
    is_read!: boolean;

    @Column({
        default: false,
    })
    is_deleted!: boolean;
}
