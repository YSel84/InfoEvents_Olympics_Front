import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Image } from 'expo-image';
import { useCartStore } from '../../stores/cartStore';
import Badge from './Badge';

export default function HeaderWeb() {
    const router = useRouter();
    const total = useCartStore((state) => state.getTotalQuantity());

    return (
        <View style={styles.container}>
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

            <View style={styles.centerSection}>
                <Text style={styles.welcome}>
                    Bienvenue sur votre billetterie
                </Text>
                <View style={styles.centerNav}>
                    <TouchableOpacity onPress={() => router.push('/lorem')}>
                        <Text style={styles.navItem}>Lorem Ipsum</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/events')}>
                        <Text style={styles.navItem}>Voir les événements</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.rightNav}>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.navItem}>Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/cart' })}
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
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
    welcome: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    navContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    navItem: {
        color: theme.colors.primary,
        fontSize: 16,
        marginHorizontal: 8,
    },
    rightNav: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    centerNav: {
        flexDirection: 'row',
        gap: 20,
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
});
