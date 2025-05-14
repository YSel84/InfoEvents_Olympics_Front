import { Slot } from 'expo-router';
import { Platform, View, ActivityIndicator } from 'react-native';
import HeaderWeb from './components/Header';
import Footer from './components/Footer';
import TabBar from './components/TabBar';
import HeaderMobile from './components/Header.mobile';
import 'react-native-get-random-values';

import { useAuthStore } from '../stores/authStore';
import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { useCartStore } from '@/stores/cartStore';

export default function RootLayout() {
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const initCart = useCartStore((s) => s.initCart);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                //fetch authStore
                await fetchProfile();
            } catch (e) {
                console.warn('fetchProfile failed', e);
            } finally {
                //initialize cart (and merge)
                try {
                    await initCart();
                } catch (e) {
                    console.warn('initCart failed', e);
                }
            }
        })().finally(() => {
            setInitializing(false);
        });
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
