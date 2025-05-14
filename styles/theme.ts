export const theme = {
    colors: {
        background: '#333333', // self-explenatory was '#1a1a1a'
        page: '#2a2a2a',
        surface: '#1a1a1a', // secondary elements like cards // was '#333333'
        text: '#f0f0f0',
        secondaryText: '#cccccc',
        primary: '#d9c47c', //action
        buttonBackground: '#d9c47c',
        buttonText: '#1a1a1a',
        border: '#444444',
        danger: '#e53935',
    },
    borderRadius: 10,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    layout: {
        //px breakpoints
        breakpoints: {
            sm: 768,
            md: 992,
            lg: 1200,
            xl: 1400,
        },
        maxWidth: {
            sm: null,
            md: 900,
            lg: 1080,
            xl: 1400,
        },
        horizontalPadding: 0,
    },
};
