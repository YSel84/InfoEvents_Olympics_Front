/**
 * Mobile only header
 *
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { theme } from '../../styles/theme';
import { useCartStore } from '../../stores/cartStore';
import Badge from './ui/Badge';
import { useAuthStore } from '../../stores/authStore';

export default function HeaderMobile() {
    const router = useRouter();
    const total = useCartStore((s) =>
        s.cartItems.reduce((sum, i) => sum + i.quantity, 0),
    );
    const user = useAuthStore((s) => s.user);
    const roles = useAuthStore((s) => s.roles);
    const logout = useAuthStore((s) => s.logout);
    const isEmployee = user && roles.includes('EMPLOYEE');

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor={theme.colors.background}
                barStyle="light-content"
            />
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    {user ? `Bonjour, ${user.firstName}` : 'InfoEvent Olympics'}
                </Text>

                <View style={styles.icons}>
                    {user ? (
                        isEmployee ? (
                            /* employee buttons… */
                            <>
                                <TouchableOpacity
                                    onPress={() => router.push('/scan')}
                                >
                                    <Ionicons
                                        name="qr-code-outline"
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        logout();
                                        router.replace('/login');
                                    }}
                                >
                                    <Ionicons
                                        name="log-out-outline"
                                        size={22}
                                        color={theme.colors.danger}
                                    />
                                </TouchableOpacity>
                            </>
                        ) : (
                            /* utilisateur classique */
                            <>
                                <TouchableOpacity
                                    onPress={() => router.push('/tickets')}
                                >
                                    <Ionicons
                                        name="receipt-outline"
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push('/cart')}
                                >
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name="cart-outline"
                                            size={24}
                                            color={theme.colors.primary}
                                        />
                                        <Badge value={total} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        logout();
                                        router.replace('/login');
                                    }}
                                >
                                    <Ionicons
                                        name="log-out-outline"
                                        size={22}
                                        color={theme.colors.danger}
                                    />
                                </TouchableOpacity>
                            </>
                        )
                    ) : (
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Ionicons
                                name="person-outline"
                                size={22}
                                color={theme.colors.primary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cartButton: {
        marginRight: theme.spacing.sm,
    },
    logo: {
        width: 36,
        height: 36,
    },
    title: {
        fontSize: 18,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    safeArea: {
        backgroundColor: theme.colors.background,
    },
    iconContainer: {
        position: 'relative',
        padding: 4,
    },
});
