import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const navItems = [
    { name: 'Accueil', route: '/' },
    { name: 'Evénements', route: '/events' },
    { name: 'Compte utilisateur', route: '/account' },
];

export default function Header() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Billetterie JO</Text>
            <View style={styles.navContainer}>
                {navItems.map((item) => (
                    <TouchableOpacity
                        key={item.route}
                        onPress={() => router.push(item.route as any)}
                    >
                        <Text style={styles.navItem}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#111',
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
});
