/**
 * web header
 *
 */ import {
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
import MainButton from './ui/MainButton';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function HeaderWeb() {
    const router = useRouter();
    const pathname = usePathname();
    const total = useCartStore((s) =>
        s.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    );
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const user = useAuthStore((s) => s.user);
    const roles = useAuthStore((s) => s.roles);
    const logout = useAuthStore((s) => s.logout);
    const isEmployee = user !== null && roles.includes('EMPLOYEE');

    const [openNav, setOpenNav] = useState(false);

    return (
        <View style={styles.container}>
            {/* logo + marque */}
            <View style={styles.leftSection}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.brand}>InfoEvent My Tickets</Text>
            </View>

            {/* liens centraux pour les non-employés */}
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
                                onPress={() => router.push('/events')}
                            >
                                <Text style={styles.navItem}>
                                    Voir les événements
                                </Text>
                            </TouchableOpacity>
                            {user && (
                                <TouchableOpacity
                                    onPress={() => router.push('/tickets')}
                                >
                                    <Text style={styles.navItem}>
                                        Mes billets
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            )}

            {/* section droite */}
            <View style={styles.rightNav}>
                {user ? (
                    <>
                        <Text style={styles.navItem}>
                            Bonjour, {user.firstName}
                        </Text>
                        <MainButton
                            label="Déconnexion"
                            onPress={() => {
                                logout();
                                router.replace('/login');
                            }}
                        />
                    </>
                ) : null}

                {/** --- Panier pour tous les non-employés (invités ET utilisateurs) --- **/}
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

                {/** Si invité, on propose aussi le bouton Se connecter **/}
                {!user && (
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: 'login',
                                params: { redirectTo: pathname },
                            })
                        }
                    >
                        <Text style={styles.navItem}>Se connecter</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* menu mobile déroulant */}
            {!isEmployee && isMobile && openNav && (
                <View style={[styles.mobileMenu, { top: 56 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push('/events');
                            setOpenNav(false);
                        }}
                    >
                        <Text style={styles.navItem}>Voir les événements</Text>
                    </TouchableOpacity>
                    {user && (
                        <TouchableOpacity
                            onPress={() => {
                                router.push('/tickets');
                                setOpenNav(false);
                            }}
                        >
                            <Text style={styles.navItem}>Mes billets</Text>
                        </TouchableOpacity>
                    )}
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
        marginLeft: theme.spacing.sm,
    },
    centerSection: {
        alignItems: 'center',
    },
    centerNav: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    navItem: {
        color: theme.colors.primary,
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: theme.spacing.sm,
    },
    rightNav: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    logo: {
        width: 40,
        height: 40,
        opacity: 0.9,
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
});
