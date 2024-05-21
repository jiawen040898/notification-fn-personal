import PushNotifications from '@pusher/push-notifications-server';

import { PusherConfig } from '../configs';

export const pusher = {
    publishDirectUser: async (
        userAccount: string,
        title: string,
        body: string,
        deepLink: string,
        icon?: string,
    ) => {
        const pushNotificationClient = new PushNotifications({
            instanceId: PusherConfig.beamsInstanceId,
            secretKey: PusherConfig.beamsSecretKey,
        });

        await pushNotificationClient.publishToUsers(
            [userAccount], //max 1000
            {
                web: {
                    notification: {
                        title,
                        body,
                        deep_link: deepLink,
                        icon,
                    },
                    data: {}, //TODO
                    time_to_live: 604800, //1 week, Default Max 4 week
                },
            },
        );
    },
    publishWebAppMessage: async (
        userAccounts: string[],
        title: string,
        body: string,
        deepLink: string,
        icon?: string,
    ) => {
        const pushNotificationClient = new PushNotifications({
            instanceId: PusherConfig.beamsInstanceId,
            secretKey: PusherConfig.beamsSecretKey,
        });

        const userAccountGroup = chunkArrayByLength(userAccounts, 1000);

        for (const userAccountItem of userAccountGroup) {
            await pushNotificationClient.publishToUsers(
                userAccountItem, //max 1000
                {
                    web: {
                        notification: {
                            title,
                            body,
                            deep_link: deepLink,
                            icon,
                        },
                        data: {}, //TODO
                        time_to_live: 604800, //1 week, Default Max 4 week
                    },
                },
            );
        }
    },
};

function chunkArrayByLength(arr: string[], chunkSize: number) {
    const newArr = [];
    let i = 0;

    while (i < arr.length) {
        newArr.push(arr.slice(i, i + chunkSize));
        i += chunkSize;
    }
    return newArr;
}
