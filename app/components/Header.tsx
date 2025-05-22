/**
 * web header
 *
 */

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Image } from 'expo-image';
import { useCartStore } from '../../stores/cartStore';
import Badge from './ui/Badge';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import MainButton from './ui/MainButton';

export default function HeaderWeb() {
    const router = useRouter();
    const pathname = usePathname();

    const total = useCartStore((state) =>
        state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    );
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    //users & roles
    const user = useAuthStore((s) => s.user);
    const roles = useAuthStore((s) => s.roles);
    const logout = useAuthStore((s) => s.logout);
    const isEmployee = user !== null && roles.includes('EMPLOYEE');

    const [openNav, setOpenNav] = useState(false);

    return (
        <View style={styles.container}>
            {/* Left: logo + brand */}
            <View style={styles.leftSection}>
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    style={styles.logoContainer}
                >
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.brand}>InfoEvent My Tickets</Text>
            </View>

            {/* Center nav links (masquées pour employee) */}
            {!isEmployee && (
                <View style={styles.centerSection}>
                    {isMobile ? (
                        <TouchableOpacity onPress={() => setOpenNav(!openNav)}>
                            <Ionicons
                                name="menu-outline"
                                size={28}
                                color={theme.colors.primary}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.centerNav}>
                            <TouchableOpacity
                                onPress={() => router.push('/lorem')}
                            >
                                <Text style={styles.navItem}>Lorem Ipsum</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/events')}
                            >
                                <Text style={styles.navItem}>
                                    Voir les événements
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* Right side: cart + login/logout */}
            <View style={styles.rightNav}>
                {!isEmployee && (
                    <TouchableOpacity onPress={() => router.push('/cart')}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="cart-outline"
                                size={24}
                                color={theme.colors.primary}
                            />
                            <Badge value={total} />
                        </View>
                    </TouchableOpacity>
                )}

                {user ? (
                    <MainButton
                        label="Déconnexion"
                        onPress={() => {
                            logout();
                            router.replace('/login');
                        }}
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() =>
                            router.push(
                                `/login?redirectTo=${encodeURIComponent(pathname)}`,
                            )
                        }
                    >
                        <Text style={styles.navItem}>Se connecter</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Mobile dropdown */}
            {!isEmployee && isMobile && openNav && (
                <View style={[styles.mobileMenu, { top: 56 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push('/lorem');
                            setOpenNav(false);
                        }}
                    >
                        <Text style={styles.navItem}>Lorem Ipsum</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.push('/events');
                            setOpenNav(false);
                        }}
                    >
                        <Text style={styles.navItem}>Voir les événements</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'visible',
        position: 'relative',
        padding: 16,
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brand: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    centerSection: {
        alignItems: 'center',
    },
    navContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    navItem: {
        color: theme.colors.primary,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: theme.spacing.sm,
    },
    rightNav: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    centerNav: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    logo: {
        width: 40,
        height: 40,
        opacity: 0.9,
    },
    logoContainer: {
        marginRight: theme.spacing.md,
    },
    iconContainer: {
        position: 'relative',
        padding: 8,
    },
    mobileMenu: {
        position: 'absolute',
        backgroundColor: theme.colors.surface,
        left: 0,
        right: 0,
        paddingVertical: theme.spacing.sm,
        zIndex: 1000,
        borderTopColor: theme.colors.border,
    },
    empLabel: {
        fontStyle: 'italic',
        color: theme.colors.secondaryText,
    },
});
