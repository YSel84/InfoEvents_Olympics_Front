import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import MainButton from '../components/ui/MainButton';
import WebWrapper from '../components/WebWrapper';

import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';

export default function AccountScreen() {
    const { user, roles, logout } = useAuthStore();
    const router = useRouter();

    //not connected => login
    if (!user) {
        router.replace('login');
        return null;
    }

    //check if user is Employee & if on the web version
    const isEmployee = roles.includes('EMPLOYEE');
    const isWeb = Platform.OS === 'web';

    return (
        <WebWrapper>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Bienvenue, {user.firstName}
                    </Text>
                    {/*Scan button, employee only */}
                    {isEmployee && (
                        <>
                            {isWeb ? (
                                <Text style={styles.webMessage}>
                                    Vous êtes connecté en tant qu'employé. Pour
                                    commencer à scanner des billets, veuillez
                                    utiliser l'application mobile.
                                </Text>
                            ) : (
                                <MainButton
                                    label="Scanner un billet"
                                    onPress={() => router.push('/scan')}
                                />
                            )}
                        </>
                    )}
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
    webMessage: {
        textAlign: 'center',
        marginVertical: 16,
        paddingHorizontal: 16,
        color: theme.colors.secondaryText,
        fontSize: 16,
        lineHeight: 22,
    },
});
