/**
 * Login page
 *
 */

import {
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    View,
    ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

//Store
import { useAuthStore } from '../stores/authStore';

import { theme } from '../styles/theme';

//Components
import WebWrapper from './components/WebWrapper';
import MainButton from './components/ui/MainButton';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const user = useAuthStore((s) => s.user);
    const isLoading = useAuthStore((s) => s.isLoading);
    const error = useAuthStore((s) => s.error);
    const params = useLocalSearchParams<{ redirectTo?: string | string[] }>();
    const target = Array.isArray(params.redirectTo)
        ? params.redirectTo[0]
        : params.redirectTo;

    //authentification const
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //if connected, redirect
    useEffect(() => {
        if (user) {
            if (target) {
                router.replace(`/${target.toString().toLowerCase()}`);
            } else {
                router.replace('/account');
            }
        }
    }, [user, target, router]);

    // spinner or nothing if reload and connected user
    if (isLoading || user) {
        return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }

    const handleSubmit = async () => {
        try {
            await login(email.trim(), password);
        } catch {
            //in error
        }
    };

    return (
        <WebWrapper>
            <KeyboardAvoidingView behavior="padding" style={styles.outer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Se connecter</Text>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    ) : null}
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholder="Mot de passe"
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <MainButton label="Connexion" onPress={handleSubmit} />
                    {/**OAuth2 button **/}
                    <Text
                        style={styles.link}
                        onPress={() => router.push('/register')}
                    >
                        Pas encore de compte? Créez-en un.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: theme.colors.page,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.secondaryText,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
    },
    error: {
        color: 'red',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    link: {
        marginTop: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.primary,
        textDecorationLine: 'underline',
    },
});
