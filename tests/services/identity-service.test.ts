import { IdentityService } from '../../src/services';

jest.mock('../../src/services/identity.service', () => {
    const mBInstance = {
        getUsersByUserAccounts: jest.fn(() => [
            {
                id: 1,
                email: 'david@pulsif.me',
                first_name: 'Abu',
                last_name: 'Akao',
                userApplications: [],
            },
        ]),
    };
    const mB = jest.fn(() => mBInstance);
    return { IdentityService: mB };
});

jest.mock('@pulsifi/fn/utils/logger.util');

describe('IdentityService', () => {
    let sut: IdentityService;

    beforeAll(() => {
        sut = new IdentityService();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('getUsersByUserAccounts', () => {
        it('should return an array of user accounts given a list of ids', async () => {
            const userIds = [1];
            const result = await sut.getUsersByUserAccounts(userIds);

            expect(result).toMatchSnapshot();
        });
    });
});
