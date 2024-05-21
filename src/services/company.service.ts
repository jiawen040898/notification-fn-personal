import { ApiResponse, cacheService, generatorUtil, logger } from '@pulsifi/fn';
import axios from 'axios';

import * as AWSConfig from '../configs';
import { CacheObject, DefaultLocale } from '../constants';
import { CompanyRes } from '../interface';

export class CompanyService {
    async getCompanyData(companyId: number): Promise<CompanyRes | null> {
        const cacheKey = generatorUtil.cacheKey(
            CacheObject.COMPANY_ID,
            companyId,
        );
        const result = await cacheService.get<CompanyRes>(cacheKey);
        if (result) {
            return result;
        }

        const url = `${
            AWSConfig.alb().dns
        }/identity/v1.0/public/companies/${companyId}`;

        try {
            const response = await axios.get<ApiResponse<CompanyRes>>(url);

            return response?.data?.data || null;
        } catch (err) {
            logger.error('Fail to getCompanyData', { err, url });
            throw err;
        }
    }

    async getCompanyLocaleByCompanyId(companyId: number): Promise<string> {
        const companyData = await this.getCompanyData(companyId);

        if (!companyData) {
            return DefaultLocale;
        }

        const companyLocale = companyData.locales.find(
            (locale) => locale.is_default,
        );

        return companyLocale?.locale || DefaultLocale;
    }
}
