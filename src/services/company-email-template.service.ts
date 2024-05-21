import { EventModel } from '@pulsifi/fn';
import { DataSource } from 'typeorm';

import { EmailTemplateUsage } from '../constants';
import { CompanyCreated } from '../interface';
import { EmailTemplate } from '../models';

export class CompanyEmailTemplateService {
    constructor(private readonly dataSource: DataSource) {}

    async setupEmailTemplate(
        message: EventModel<CompanyCreated>,
    ): Promise<void> {
        const companyCreatedPayload = message.data;

        const defaultEmailTemplates = await this.dataSource
            .getRepository(EmailTemplate)
            .find({
                where: {
                    usage: EmailTemplateUsage.DEFAULT,
                    is_deleted: false,
                },
            });

        const companyEmailTemplates = defaultEmailTemplates.map((i) => {
            return <EmailTemplate>{
                ...i,
                id: undefined,
                company_id: companyCreatedPayload.company_id,
                usage: EmailTemplateUsage.CLIENT,
                created_by: message.user_account_id,
                created_at: undefined,
                updated_by: message.user_account_id,
                updated_at: undefined,
            };
        });

        await this.dataSource.transaction(async (manager) => {
            await manager.create(EmailTemplate, companyEmailTemplates);
        });
    }
}
