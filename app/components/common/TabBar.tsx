import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../styles/theme';
import { useAuthStore } from '@/stores/authStore';

export default function TabBar() {
    const router = useRouter();
    const roles = useAuthStore((s) => s.roles);
    const user = useAuthStore((s) => s.user);
    const isEmployee = user !== null && roles.includes('EMPLOYEE');

    //dynamic tabs depending on roles
    const tabs = [
        { name: 'Accueil', route: '/' },
        ...(!isEmployee ? [{ name: 'Evenements', route: '/events' }] : []),
        { name: 'Compte', route: '/account' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.route}
                    onPress={() => router.push(tab.route as any)}
                >
                    <Text style={styles.tab}>{tab.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderColor: theme.colors.border,
    },
    tab: {
        fontSize: 16,
        color: theme.colors.buttonBackground,
    },
    activeTab: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: 'bold',
    },
});
