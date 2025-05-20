/**
 * Account creation page
 *
 */

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    TextInput,
    Text,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { useAuthStore } from '../stores/authStore';

import MainButton from './components/ui/MainButton';
import { DatePickerField } from './components/ui/DatePicker';
import { theme } from '../styles/theme';

export default function RegisterPage() {
    const router = useRouter();
    const register = useAuthStore((s) => s.register);
    const user = useAuthStore((s) => s.user);
    const isLoading = useAuthStore((s) => s.isLoading);
    const error = useAuthStore((s) => s.error);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    useEffect(() => {
        if (user) {
            router.replace('/account');
        }
    }, [user, router]);

    const handleSubmit = async () => {
        if (password !== confirm) {
            return; //confirmation message should be added
        }
        try {
            await register({
                email,
                firstName,
                lastName,
                dateOfBirth,
                password,
            });
        } catch {
            //store-managed
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Text style={styles.title}>Créer un compte</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : null}

            <TextInput
                placeholder="Prénom"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                placeholder="Nom"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <DatePickerField date={dateOfBirth} onChange={setDateOfBirth} />
            <TextInput
                placeholder="Mot de passe"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                placeholder="Confirmer le mot de passe"
                style={styles.input}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <MainButton label="S'inscrire" onPress={handleSubmit} />
            <Text style={styles.link} onPress={() => router.push('/login')}>
                Déjà un compte? Connectez-vous.{' '}
            </Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
        backgroundColor: theme.colors.page,
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
        backgroundColor: theme.colors.secondaryText,
        borderColor: theme.colors.secondaryText,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        color: theme.colors.surface,
    },
    error: {
        color: theme.colors.danger ?? 'red',
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
