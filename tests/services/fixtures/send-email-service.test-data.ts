import { EntityTestData } from 'tests/setup';

import { EmailTemplate } from '../../../src/models';
import { testEmailTemplateBuilder } from '../../builders';

const emailTemplate1: EmailTemplate = testEmailTemplateBuilder.build();
const emailTemplate2: EmailTemplate = testEmailTemplateBuilder.build();

const entitiesToBeAddedToDb: EntityTestData[] = [
    {
        entityClass: EmailTemplate,
        data: [emailTemplate1, emailTemplate2],
    },
];
export const testData = {
    emailTemplate1,
    emailTemplate2,
    entitiesToBeAddedToDb,
};
