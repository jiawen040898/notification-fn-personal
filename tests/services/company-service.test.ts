import { cacheService, logger } from '@pulsifi/fn';
import axios from 'axios';

import { DefaultLocale, Locale } from '../../src/constants';
import { CompanyService } from '../../src/services';
import { testData } from './fixtures/company-service.test-data';

jest.mock('axios');
jest.mock('@pulsifi/fn/utils/logger.util');
jest.mock('@pulsifi/fn/services/cache.service');

describe('CompanyService', () => {
    let sut: CompanyService;

    beforeAll(async () => {
        sut = new CompanyService();
    });

    describe('getCompanyData', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return null if invalid company id', async () => {
            const actual = await sut.getCompanyData(testData.invalidCompanyId);

            expect(actual).toBeNull();
        });

        it('should return cached data if available', async () => {
            // Arrange
            jest.mocked(cacheService.get).mockResolvedValueOnce(
                testData.companyData,
            );

            // Act
            const actual = await sut.getCompanyData(testData.validCompanyId);

            // Assert
            expect(actual).toMatchSnapshot();
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should return expected data from api', async () => {
            // Arrange
            const axiosGetMock = jest.mocked(axios.get);
            axiosGetMock.mockResolvedValueOnce(testData.companyAxiosResponse);

            // Act
            const actual = await sut.getCompanyData(testData.validCompanyId);

            // Assert
            expect(actual).toMatchSnapshot();
            expect(axiosGetMock.mock.calls).toMatchSnapshot('axios.get');
        });

        it('should log error if error occurs', async () => {
            // Arrange
            const axiosGetMock = jest.mocked(axios.get);
            axiosGetMock.mockRejectedValueOnce(new Error('AxiosError'));

            // Act
            const action = () => sut.getCompanyData(testData.validCompanyId);

            // Assert
            await expect(action()).rejects.toThrowError();
            expect(jest.mocked(logger.error).mock.calls).toMatchSnapshot(
                'logger.error',
            );
        });
    });

    describe('getCompanyLocaleByCompanyData', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return default locale when company data is null', async () => {
            // Arrange
            jest.mocked(cacheService.get).mockResolvedValueOnce(null);

            // Act
            const actual = await sut.getCompanyLocaleByCompanyId(
                testData.validCompanyId,
            );

            // Assert
            expect(actual).toEqual(DefaultLocale);
        });

        it('should return default locale when company data has no default locale', async () => {
            // Arrange
            jest.mocked(cacheService.get).mockResolvedValueOnce(
                testData.companyDataThatHasNoDefaultLocale,
            );

            // Act
            const actual = await sut.getCompanyLocaleByCompanyId(
                testData.validCompanyId,
            );

            // Assert
            expect(actual).toEqual(DefaultLocale);
        });

        it('should return company locale when company data has a default locale', async () => {
            // Arrange
            jest.mocked(cacheService.get).mockResolvedValueOnce(
                testData.companyData,
            );

            // Act
            const actual = await sut.getCompanyLocaleByCompanyId(
                testData.validCompanyId,
            );

            // Assert
            expect(actual).toEqual(Locale.PT_BR);
        });
    });
});
