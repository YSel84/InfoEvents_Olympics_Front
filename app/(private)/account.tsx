import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MainButton from '../components/MainButton';
import WebWrapper from '../components/WebWrapper';

import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';

export default function AccountScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    //not connected => login
    if (!user) {
        router.replace('login');
        return null;
    }

    return (
        <WebWrapper>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Bienvenue, {user.firstName}
                    </Text>
                    <MainButton
                        label="Déconnexion"
                        onPress={() => {
                            logout();
                            router.replace('/login');
                        }}
                        style={{ backgroundColor: theme.colors.danger }}
                    />
                </View>
            </ScrollView>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});
