import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderWeb() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    style={styles.logoContainer}
                >
                    <Text style={styles.logo}>Logo</Text>
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
                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="cart-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#111',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brand: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centerSection: {
        alignItems: 'center',
    },
    welcome: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    navContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    navItem: {
        color: '#fff',
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
        fontSize: 24,
        color: '#fff',
    },
    logoContainer: {
        marginRight: 16,
    },
});
