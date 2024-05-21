import { DataSource } from 'typeorm';

import {
    EmailActivityMessage,
    EmailActivityMessageDeliveryStatus,
} from '../../src/models';
import { EmailTrackingService } from '../../src/services';
import { testData } from '../fixtures';
import { getTestDataSource } from '../setup/test-database.setup';

jest.mock('@pulsifi/fn/utils/logger.util');

describe('[handleBounceNotification]', () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await getTestDataSource();
    });

    afterAll(() => {
        dataSource.destroy();
        jest.resetAllMocks();
    });

    it('should pass update open notification', async () => {
        // Arrange
        const sesMessageId = testData.sesMessageId1;
        await dataSource.transaction(async (manager) => {
            const emailLog = testData.emailLog1;
            await manager.save(EmailActivityMessage, emailLog);
        });

        const sesNotification = testData.sesNotification3;

        // Act
        await new EmailTrackingService(dataSource).updateEmailDeliveryStatus(
            sesNotification,
        );

        // Assert
        const foundEmailLog = await dataSource
            .getRepository(EmailActivityMessage)
            .findOneBy({ ext_ses_message_id: sesMessageId });
        expect(foundEmailLog?.delivery_status).toEqual(
            EmailActivityMessageDeliveryStatus.SENT,
        );
        expect(foundEmailLog?.open_count).toBeGreaterThan(0);
        expect(foundEmailLog?.open_detail).not.toBeNull();
    });

    it('should pass update click notification', async () => {
        // Arrange
        const sesMessageId = testData.sesMessageId2;
        await dataSource.transaction(async (manager) => {
            const emailLog = testData.emailLog2;
            await manager.save(EmailActivityMessage, emailLog);
        });

        const sesNotification = testData.sesNotification4;

        // Act
        await new EmailTrackingService(dataSource).updateEmailDeliveryStatus(
            sesNotification,
        );

        // Assert
        const foundEmailLog = await dataSource
            .getRepository(EmailActivityMessage)
            .findOneBy({ ext_ses_message_id: sesMessageId });
        expect(foundEmailLog?.delivery_status).toEqual(
            EmailActivityMessageDeliveryStatus.SENT,
        );
        expect(foundEmailLog?.click_count).toBeGreaterThan(0);
        expect(foundEmailLog?.click_detail).not.toBeNull();
    });
});
