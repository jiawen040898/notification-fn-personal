import * as Factory from 'factory.ts';

import {
    EmailTemplateCommunicationType,
    EmailTemplateUsage,
    Locale,
} from '../../src/constants';
import { EmailTemplate } from '../../src/models';

export const testEmailTemplateBuilder = Factory.Sync.makeFactory<EmailTemplate>(
    {
        id: Factory.each((i) => i + 1),
        company_id: 1,
        subject: 'Hello world {{job_title}}',
        sender_name: 'Sender',
        email_communication_type:
            EmailTemplateCommunicationType.APPLICATION_SHORTLIST,
        body_in_html: '<html>Hello {{first_name}} {{year}}</html>',
        usage: EmailTemplateUsage.CLIENT,
        language: Locale.EN_US,
        is_deleted: false,
        created_by: 1,
        updated_by: 1,
    },
);
