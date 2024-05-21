import { DataSource } from 'typeorm';

import {
    EmailActivityMessage,
    EmailActivityMessageDeliveryStatus,
    EmailActivityMessageFailureCode,
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

    it('should pass update bounce notification', async () => {
        // Arrange
        const sesMessageId = testData.sesMessageId1;
        await dataSource.transaction(async (manager) => {
            const emailLog: EmailActivityMessage = testData.emailLog1;
            await manager.save(EmailActivityMessage, emailLog);
        });

        const sesNotification = testData.sesNotification1;

        // Act
        await new EmailTrackingService(dataSource).updateEmailDeliveryStatus(
            sesNotification,
        );

        // Assert
        const foundEmailLog = await dataSource
            .getRepository(EmailActivityMessage)
            .findOneBy({ ext_ses_message_id: sesMessageId });
        expect(foundEmailLog?.delivery_status).toEqual(
            EmailActivityMessageDeliveryStatus.BOUNCED,
        );
        expect(foundEmailLog?.failure_reason_code).toEqual(
            EmailActivityMessageFailureCode.BOUNCED,
        );
    });

    it('should pass update complaint notification', async () => {
        // Arrange
        const sesMessageId = testData.sesMessageId2;
        await dataSource.transaction(async (manager) => {
            const emailLog = testData.emailLog2;
            await manager.save(EmailActivityMessage, emailLog);
        });

        const sesNotification = testData.sesNotification2;

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
        expect(foundEmailLog?.complaint_detail).not.toBeNull();
    });
});
