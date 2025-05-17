import 'dotenv/config';

export default {
    expo: {
        name: 'InfoEvents_OlympicsTicketing',
        slug: 'InfoEvents_OlympicsTicketing',
        version: '1.0.0',
        android: {
            package: 'com.ysel84.infoevents_ticketing',
        },
        extra: {
            eas: {
                projectId: '31e68330-576a-47c9-a7db-78c7f91398d2',
            },
            API_BASE_URL:
                process.env.EXPO_PUBLIC_API_BASE_URL ??
                'http://localhost:5000/api',
        },
    },
    plugins: [
        /**  [
            'expo-constants',
            {
                extra: {
                    API_BASE_URL: process.env.API_BASE_URL,
                },
                ...defaultExtra,
                EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
                //API_BASE_URL: process.env.API_BASE_URL,
                FRONT_USERNAME: process.env.FRONT_USERNAME,
                FRONT_PASSWORD: process.env.FRONT_PASSWORD,
            },
        ],*/
        [
            'expo-secure-store',
            {
                configureAndroidBackup: true,
            },
        ],
    ],
};
