import 'dotenv/config';

export default {
    expo: {
        name: 'InfoEvents_OlympicsTicketing',
        slug: 'InfoEvents_OlympicsTicketing',
        version: '1.0.0',
        extra: {
            API_BASE_URL:
                process.env.EXPO_PUBLIC_API_BASE_URL ??
                'http://localhost:8080/api',
            FRONT_USERNAME: process.env.EXPO_PUBLIC_FRONT_USERNAME,
            FRONT_PASSWORD: process.env.EXPO_PUBLIC_FRONT_PASSWORD,
        },
    },
    plugins: [
        [
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
        ],
        [
            'expo-secure-store',
            {
                configureAndroidBackup: true,
            },
        ],
    ],
};
