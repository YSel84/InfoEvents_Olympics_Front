import { Slot } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import HeaderWeb from './components/Header';
import Footer from './components/Footer';
import TabBar from './components/TabBar';
import HeaderMobile from './components/Header.mobile';

import { useAuthStore } from '../stores/authStore';
import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';

export default function RootLayout() {
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        fetchProfile().finally(() => setInitializing(false));
    }, [fetchProfile]);

    if (initializing) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.page,
                }}
            >
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }
    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === 'web' ? <HeaderWeb /> : <HeaderMobile />}
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
            {Platform.OS === 'web' ? <Footer /> : <TabBar />}
        </View>
    );
}
