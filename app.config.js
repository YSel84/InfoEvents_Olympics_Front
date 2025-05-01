import 'dotenv/config';

export default {
    expo: {
        name: 'InfoEvents_OlympicsTicketing',
        slug: 'InfoEvents_OlympicsTicketing',
        version: '1.0.0',
        extra: {
            API_BASE_URL: process.env.API_BASE_URL,
        },
    },
    plugins: [
        [
            'expo-constants',
            {
                extra: {
                    API_BASE_URL: process.env.API_BASE_URL,
                },
            },
        ],
        [
            'expo-secure-store',
            {
                configureAndroidBackup: true,
            },
        ],
    ],
};
