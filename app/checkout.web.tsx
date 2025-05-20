/**
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useCartStore } from '@/stores/cartStore';
import { useOfferStore } from '@/stores/offerStore';
import { useAuthStore } from '@/stores/authStore';
import { fetchWithAuth } from '../app/lib/_api'; 

import WebWrapper from './components/WebWrapper';
import ScrollContainer from './components/ScrollContainer';
import MainButton from './components/ui/MainButton';
import { theme } from '../styles/theme';

export default function CheckoutScreenWeb() {
    const router = useRouter();
    const sessionId = useCartStore((s) => s.sessionId);
    const cartId = useCartStore((s) => s.cartId);
    const cartItems = useCartStore((s) => s.cartItems);
    const offersByEvent = useOfferStore((s) => s.offersByEvent);
    const cartErrors = useCartStore((s) => s.errors);
    const accessToken = useAuthStore((s) => s.accessToken);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);

    // Calcul du total du panier
    const priceTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const offer = (offersByEvent[item.eventId] ?? []).find(
                (o: any) => o.offerId === item.offerId,
            );
            return sum + (offer?.price ?? 0) * item.quantity;
        }, 0);
    }, [cartItems, offersByEvent]);

    const handlePay = async () => {
        if (loading) return;
        setLoading(true);
        try {
            // 1) Vérifie d'abord les erreurs métier
            if (cartErrors.length > 0) {
                Alert.alert('Erreur', cartErrors.join('\n'));
                return;
            }
            // 2) Envoie la requête au back pour valider le panier / générer les tickets
            const res = await fetchWithAuth('/cart/validate', {
                method: 'POST',
                body: JSON.stringify({ cartId }),
            });
            if (!res.ok) {
                throw new Error(`Échec du paiement (${res.status})`);
            }
            const data = await res.json();
            // 3) Navigate to confirmation, passing QR hashes
            router.replace({
                pathname: '/confirmation',
                params: { qrHashes: data.qrHashes },
            });
        } catch (e: any) {
            Alert.alert('Erreur', e.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <Text style={styles.title}>Validation du panier</Text>

                // Récapitulatif du panier 
                {cartItems.map((item) => {
                    const offer = (offersByEvent[item.eventId] ?? []).find(
                        (o: any) => o.offerId === item.offerId,
                    );
                    return (
                        <View key={item.id} style={styles.item}>
                            <View style={styles.infoColumn}>
                                <Text style={styles.eventTitle}>
                                    {item.eventTitle}
                                </Text>
                                <Text style={styles.offerLabel}>
                                    {offer?.name ?? ''}
                                </Text>
                            </View>
                            <View style={styles.actionColumn}>
                                <Text style={styles.linePrice}>
                                    {(
                                        (offer?.price ?? 0) * item.quantity
                                    ).toFixed(2)}{' '}
                                    €
                                </Text>
                            </View>
                        </View>
                    );
                })}

                <Text style={styles.total}>
                    Total : {priceTotal.toFixed(2)} €
                </Text>

                //Erreurs métier 
                {cartErrors.map((err) => (
                    <Text key={err} style={styles.errorText}>
                        {err}
                    </Text>
                ))}

                //Formulaire mock de paiement 
                <Text style={styles.subtitle}>Informations de paiement</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de carte"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    value={expiry}
                    onChangeText={setExpiry}
                />
                <TextInput
                    style={styles.input}
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    secureTextEntry
                    keyboardType="numeric"
                />

                //Bouton Payer
                <View style={styles.buttonContainer}>
                    <MainButton
                        label={loading ? 'Paiement en cours…' : 'Payer'}
                        onPress={handlePay}
                    />
                </View>
            </ScrollContainer>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    infoColumn: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    offerLabel: {
        fontSize: 14,
        color: theme.colors.secondaryText,
    },
    actionColumn: {
        justifyContent: 'center',
    },
    linePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: theme.spacing.lg,
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    cardElementContainer: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    buttonContainer: {
        marginTop: theme.spacing.lg,
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    input: {
        height: 44,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.borderRadius,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
});*/
