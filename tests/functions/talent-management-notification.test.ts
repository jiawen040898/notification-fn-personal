import mockDate from 'mockdate';
import { DataSource } from 'typeorm';

import { TalentManagementNotificationService } from '../../src/services';
import { testData } from '../fixtures';
import { getTestDataSource } from '../setup/test-database.setup';

const mockSESClient = {
    send: jest.fn(),
};

jest.mock('@aws-sdk/client-ses', () => {
    const actualFn = jest.requireActual('@aws-sdk/client-ses');
    return {
        ...actualFn,
        SESClient: jest.fn(() => mockSESClient),
    };
});

const mockSQSClient = {
    send: jest.fn(),
};

jest.mock('@aws-sdk/client-sqs', () => {
    const actualFn = jest.requireActual('@aws-sdk/client-sqs');
    return {
        ...actualFn,
        SQSClient: jest.fn(() => mockSQSClient),
    };
});

jest.mock('@pulsifi/fn/utils/logger.util');

describe('TalentManagementNotificationService', () => {
    let dataSource: DataSource;
    let talentManagementNotificationService: TalentManagementNotificationService;

    beforeAll(async () => {
        dataSource = await getTestDataSource();
        talentManagementNotificationService =
            new TalentManagementNotificationService(dataSource);
        mockDate.set(new Date('2022-12-31T18:30:40.123Z'));
    });

    beforeEach(() => {
        mockSQSClient.send.mockClear();
    });

    afterAll(() => {
        mockDate.reset();
    });

    describe('notifyTaskAssigned', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskAssigned(
                testData.taskAssignedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskAssigned({
                ...testData.taskAssignedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyGoalAssigned', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalAssigned(
                testData.goalAssignedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalAssigned({
                ...testData.goalAssignedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyGoalAndTaskDue', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalAndTaskDue(
                testData.goalAndTaskDueEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalAndTaskDue({
                ...testData.goalAndTaskDueEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyTaskCompleted', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskCompleted(
                testData.taskCompletedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskCompleted({
                ...testData.taskCompletedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyGoalCompleted', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalCompleted(
                testData.goalCompletedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalCompleted({
                ...testData.goalCompletedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyTaskUpdated', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskUpdated(
                testData.taskAssignedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskUpdated({
                ...testData.taskAssignedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyGoalUpdated', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalUpdated(
                testData.goalAssignedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalUpdated({
                ...testData.goalAssignedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyTaskDeleted', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskDeleted(
                testData.taskAssignedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyTaskDeleted({
                ...testData.taskAssignedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyGoalDeleted', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalDeleted(
                testData.goalAssignedEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyGoalDeleted({
                ...testData.goalAssignedEvent,
                user_account_id: 0,
            });

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('sendManagerSubordinateProgressReport', () => {
        it('should trigger send email sqs', async () => {
            // Act
            await talentManagementNotificationService.sendManagerSubordinateProgressReport(
                testData.sendManagerSubordinateEvent,
            );

            // Assert
            expect(mockSQSClient.send).toHaveBeenCalledTimes(1);

            const input: SafeAny = mockSQSClient.send.mock.calls[0][0].input;
            const messageBody = JSON.parse(input.MessageBody);
            expect(messageBody).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.sendManagerSubordinateProgressReport(
                { ...testData.sendManagerSubordinateEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationSubmissionDue', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationSubmissionDue(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationSubmissionDue(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationSubmissionDue', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationSubmissionDue(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationSubmissionDue(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackManagerNominationApprovalDue', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationApprovalDue(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationApprovalDue(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackRevieweeResponseSubmissionDue', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackRevieweeResponseSubmissionDue(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackRevieweeResponseSubmissionDue(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackReviewerResponseSubmissionDue', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackReviewerResponseSubmissionDue(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackReviewerResponseSubmissionDue(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackManagerNominationAutoApproved', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationAutoApproved(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationAutoApproved(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationApproved', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationApproved(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationApproved(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationAmendmentApproved', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationAmendmentApproved(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationAmendmentApproved(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackReviewerResponseReady', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackReviewerResponseReady(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackReviewerResponseReady(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackRevieweeResponseReady', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackRevieweeResponseReady(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackRevieweeResponseReady(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackRevieweeResultReady', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackRevieweeResultReady(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackRevieweeResultReady(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackManagerDirectReportResultReady', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerDirectReportResultReady(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerDirectReportResultReady(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationRequest', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationRequest(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationRequest(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationApprovalRequest', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationApprovalRequest(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationApprovalRequest(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackNominationAdminAmendment', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationAdminAmendment(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackNominationAdminAmendment(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyFeedbackManagerNominationAdminAmendment', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationAdminAmendment(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyFeedbackManagerNominationAdminAmendment(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyEmployeeFeedbackRecommendationCompleted', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyEmployeeFeedbackRecommendationCompleted(
                testData.feedbackReminderEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyEmployeeFeedbackRecommendationCompleted(
                { ...testData.feedbackReminderEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyParticipantProgramResultReady', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyParticipantProgramResultReady(
                testData.programResultReadyEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyParticipantProgramResultReady(
                { ...testData.programResultReadyEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });

    describe('notifyParticipantProgramInvitation', () => {
        it('should run without error', async () => {
            // Act
            await talentManagementNotificationService.notifyParticipantProgramInvitation(
                testData.programInviteEvent,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should not trigger push notification if user_account_id not more 0', async () => {
            // Act
            await talentManagementNotificationService.notifyParticipantProgramInvitation(
                { ...testData.programInviteEvent, user_account_id: 0 },
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });
    });
});
