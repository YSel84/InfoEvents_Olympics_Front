import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    expo: {
        ...config.expo,
        name: 'InfoEvents_OlympicsTicketing',
        slug: 'InfoEvents_OlympicsTicketing',
        version: '1.0.0',
    },
    extra: {
        API_BASE_URL: process.env.API_BASE_URL,
        FRONT_USERNAME: process.env.FRONT_USERNAME,
        FRONT_PASSWORD: process.env.FRONT_PASSWORD,
    },
});
