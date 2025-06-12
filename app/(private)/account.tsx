import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import MainButton from '../components/ui/MainButton';
import WebWrapper from '../components/utils/WebWrapper';

import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';

export default function AccountScreen() {
    const { user, roles, logout } = useAuthStore();
    const router = useRouter();

    //not connected => login
    if (!user) {
        router.replace('/login');
        return null;
    }

    //check if user is Employee & if on the web version
    const isEmployee = roles.includes('EMPLOYEE');
    const isWeb = Platform.OS === 'web';
    const isAdmin = roles.includes('ADMIN');

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
                    {/* Admin tools section */}
                    {isAdmin && (
                        <View style={styles.adminSection}>
                            <Text style={styles.adminHeading}>
                                Outils d'administration
                            </Text>
                            <MainButton
                                label="Gérer les offres"
                                onPress={() => router.push('/admin/offers')}
                                style={{ width: 220 }}
                            />
                            <MainButton
                                label="Gérer les événements"
                                onPress={() => router.push('/admin/events')}
                                style={[styles.secondButton, { width: 220 }]}
                            />
                        </View>
                    )}

                    <MainButton
                        label="Déconnexion"
                        onPress={() => {
                            logout();
                            router.replace('/login');
                        }}
                        style={{
                            backgroundColor: theme.colors.secondaryText,
                            marginTop: theme.spacing.md,
                        }}
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
        color: theme.colors.primary,
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
    adminSection: {
        marginTop: 32,
        padding: 16,
        alignItems: 'center',

        borderRadius: 8,
        backgroundColor: theme.colors.surface,
        width: '100%',
    },
    adminHeading: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        color: theme.colors.primary,
    },
    secondButton: {
        marginTop: 12,
    },
});
