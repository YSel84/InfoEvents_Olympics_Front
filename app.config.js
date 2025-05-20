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
                'http://192.168.1.123:5000/api',
            STRIPE_PUBLISHABLE_KEY:
                process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
        },
    },
    plugins: [
        [
            'expo-secure-store',
            {
                configureAndroidBackup: true,
            },
        ],
    ],
};
