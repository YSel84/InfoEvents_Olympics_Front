import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/stores/cartStore';
import MainButton from '../components/ui/MainButton';
import WebWrapper from '../components/utils/WebWrapper';
import { theme } from '../../styles/theme';

export default function CheckoutScreen() {
    const { total, qrHashes, clearItems } = useCartStore();
    const router = useRouter();

    // Form state
    const [cardNumber, setCardNumber] = useState('4200 4200 4200 4200'); // fixed
    const [expiry, setExpiry] = useState('12/34');
    const [cvv, setCvv] = useState('123');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = () => {
        // Always "ok"
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            // purge cart once payment confirmed
            clearItems();
        }, 2000);
    };

    const handleGoHome = () => {
        router.replace('/');
    };

    const handleGoOrders = () => {
        router.push('/tickets');
    };

    // Before payment, render form
    if (!success) {
        return (
            <WebWrapper>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Paiement simulé</Text>
                    <Text style={styles.subtitle}>
                        Montant à payer : {total.toFixed(2)} €
                    </Text>

                    {/* Card form */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Numéro de carte</Text>
                        <TextInput
                            style={styles.input}
                            value={cardNumber}
                            keyboardType="number-pad"
                            onChangeText={setCardNumber}
                            placeholder="1234 5678 9012 3456"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.formGroup, styles.halfWidth]}>
                            <Text style={styles.label}>Date d'expiration</Text>
                            <TextInput
                                style={styles.input}
                                value={expiry}
                                onChangeText={setExpiry}
                                placeholder="MM/AA"
                            />
                        </View>
                        <View style={[styles.formGroup, styles.halfWidth]}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={styles.input}
                                value={cvv}
                                keyboardType="number-pad"
                                secureTextEntry
                                onChangeText={setCvv}
                                placeholder="123"
                            />
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    ) : (
                        <MainButton
                            label="Payer"
                            onPress={handlePayment}
                            style={[styles.payButton, { alignSelf: 'center' }]}
                            size="large"
                        />
                    )}
                </ScrollView>
            </WebWrapper>
        );
    }

    // After payment success
    return (
        <WebWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Confirmation de votre commande</Text>
                <Text style={styles.total}>
                    Montant débité : {total.toFixed(2)} €
                </Text>

                <Text style={styles.subtitle}>Vos e-billets :</Text>
                {qrHashes.length === 0 ? (
                    <Text style={styles.empty}>Aucun billet généré.</Text>
                ) : (
                    qrHashes.map((hash, idx) => (
                        <View key={idx} style={styles.ticketContainer}>
                            <Text style={styles.ticketLabel}>
                                Billet #{idx + 1}
                            </Text>
                            <Text style={styles.qrHash}>{hash}</Text>
                        </View>
                    ))
                )}

                <MainButton
                    label="Voir mes commandes"
                    onPress={handleGoOrders}
                    style={[styles.actionButton, { alignSelf: 'center' }]}
                />
                <MainButton
                    label="Retour à l'accueil"
                    onPress={handleGoHome}
                    style={[styles.actionButton, { alignSelf: 'center' }]}
                />
            </ScrollView>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.page,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: theme.spacing.md,
        color: theme.colors.secondaryText,
    },
    formGroup: {
        marginBottom: theme.spacing.md,
    },
    label: {
        marginBottom: 4,
        color: theme.colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: theme.spacing.sm,
        fontSize: 12,
        backgroundColor: theme.colors.background,
        color: theme.colors.secondaryText,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    payButton: {
        marginTop: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
    },
    ticketContainer: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
    },
    ticketLabel: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: theme.colors.text,
    },
    qrHash: {
        fontFamily: 'monospace',
        color: theme.colors.secondaryText,
    },
    empty: {
        fontSize: 12,
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.md,
    },
    actionButton: {
        marginVertical: theme.spacing.sm,
    },
});
