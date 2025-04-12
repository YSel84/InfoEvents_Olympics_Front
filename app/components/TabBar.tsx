import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

const tabs = [
    { name: 'Accueil', route: '/' },
    { name: 'Evénements', route: '/events' },
    { name: 'Compte', route: '/account' },
];

export default function TabBar() {
    const router = useRouter();
    const segments = useSegments();

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.route}
                    onPress={() => router.push(tab.route as any)}
                >
                    <Text
                        style={
                            segments[0] === tab.route.slice(1)
                                ? styles.activeTab
                                : styles.tab
                        }
                    >
                        {tab.name}
                    </Text>
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
        backgroundColor: '#eee',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    tab: {
        fontSize: 16,
        color: '#888',
    },
    activeTab: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});
