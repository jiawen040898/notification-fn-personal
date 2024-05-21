import { DataSource } from 'typeorm';

import {
    DefaultLocale,
    EmailTemplateCommunicationType,
} from '../../src/constants';
import { SendEmailService } from '../../src/services';
import { testData as generalTestData } from '../fixtures';
import { getTestDataSourceAndAddData } from '../setup';
import { testData } from './fixtures/send-email-service.test-data';

jest.mock('@pulsifi/fn/utils/logger.util');

jest.mock('../../src/services/company.service', () => {
    const mBInstance = {
        getCompanyData: jest.fn(() => [generalTestData.companyDataResponse]),
        getCompanyLocaleByCompanyId: jest.fn(() => [DefaultLocale]),
    };
    const mB = jest.fn(() => mBInstance);
    return { CompanyService: mB };
});

describe('getEmailTemplate', () => {
    let dataSource: DataSource;
    let sut: SendEmailService;

    beforeAll(async () => {
        dataSource = await getTestDataSourceAndAddData(
            testData.entitiesToBeAddedToDb,
        );

        sut = new SendEmailService(dataSource);
    });

    afterAll(() => {
        dataSource.destroy();
    });

    it('should pass getting email template if email communication type is not provided', async () => {
        // Act
        const actual = await sut.getEmailTemplate(
            testData.emailTemplate1.company_id,
            testData.emailTemplate1.id,
        );

        // Assert
        expect(actual).toMatchSnapshot({
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        });
    });

    it('should pass getting email template if email template id is not provided', async () => {
        // Act
        const actual = await sut.getEmailTemplate(
            testData.emailTemplate1.company_id,
            undefined,
            EmailTemplateCommunicationType.APPLICATION_SHORTLIST,
        );

        // Assert
        expect(actual).toMatchSnapshot({
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        });
    });

    it('should pass getting correct email template when there are two and above same email communication type in a company', async () => {
        // Act
        const actual = await sut.getEmailTemplate(
            testData.emailTemplate2.company_id,
            testData.emailTemplate2.id,
            EmailTemplateCommunicationType.APPLICATION_SHORTLIST,
        );

        // Assert
        expect(actual).toMatchSnapshot({
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        });
    });

    it('should fail getting email template', async () => {
        // Act
        const action = () =>
            sut.getEmailTemplate(testData.emailTemplate1.company_id);

        // Assert
        await expect(action()).rejects.toThrow('No email template found');
    });
});
