import { Locale } from '../../../src/constants';
import { CompanyRes } from '../../../src/interface';
import { testUtil } from '../../../tests/setup';

const validCompanyId = 123;
const invalidCompanyId = -1;
const nonExistCompanyId = 777_888;

const companyData: CompanyRes = {
    id: validCompanyId,
    name: 'test company',
    slug: 'test-company',
    timezone: 'Asia/Kuala_Lumpur',
    locales: [
        { locale: Locale.EN_US, is_default: false },
        { locale: Locale.PT_BR, is_default: true },
    ],
};

const companyDataThatHasNoDefaultLocale: CompanyRes = {
    id: 789,
    name: 'company has no default locale',
    slug: 'no-locale-company',
    timezone: 'Asia/Kuala_Lumpur',
    locales: [{ locale: Locale.EN_US, is_default: false }],
};

const companyAxiosResponse = testUtil.mockAxiosResponse(companyData);

export const testData = {
    companyData,
    companyDataThatHasNoDefaultLocale,
    validCompanyId,
    invalidCompanyId,
    nonExistCompanyId,
    companyAxiosResponse,
};
