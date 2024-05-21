import { ApiResponse } from '@pulsifi/fn';
import { AxiosResponse } from 'axios';

const mockAxiosResponse = <T>(obj: T): AxiosResponse<ApiResponse<T>> => {
    return {
        data: {
            data: obj,
        },
        status: 200,
        statusText: 'OK',
        headers: {} as SafeAny,
        config: {} as SafeAny,
    };
};

export const testUtil = {
    mockAxiosResponse,
};
