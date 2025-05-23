import React, { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import HeaderWeb from './components/Header';
import HeaderMobile from './components/Header.mobile';
import Footer from './components/common/Footer';
import TabBar from '../app/components/common/TabBar';

import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { theme } from '../styles/theme';

export default function RootLayout() {
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const initCart = useCartStore((s) => s.initCart);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await fetchProfile();
            } catch (e) {
                console.warn('fetchProfile failed', e);
            }
            try {
                await initCart();
            } catch (e) {
                console.warn('initCart failed', e);
            }
            setInitializing(false);
        })();
    }, [fetchProfile, initCart]);

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
