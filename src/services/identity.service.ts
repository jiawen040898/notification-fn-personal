import { logger } from '@pulsifi/fn';
import axios from 'axios';

import * as AWSConfig from '../configs';
import { UserAccount } from '../interface';

export class IdentityService {
    async getUsersByUserAccounts(ids: number[]): Promise<UserAccount[]> {
        const url = `${AWSConfig.alb().dns}identity/v1.0/users?ids=${ids.join(
            ',',
        )}`;
        //TODO
        // const headers = {
        //     'Content-Type': 'application/json',
        //     Authentication: 'Bearer 97e0d315477f435489cf04904c9d0e6co',
        // };

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            logger.error('Fail to getUsersByUserAccounts', { err });
            throw err;
        }
    }
}
