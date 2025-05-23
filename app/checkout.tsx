/**
import React, { useMemo, useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// SDK Stripe natif — statique car exclusif aux plateformes natives
import { CardField, useStripe } from '@stripe/stripe-react-native';

import { useCartStore } from '@/stores/cartStore';
import { useOfferStore } from '@/stores/offerStore';

import WebWrapper from './components/WebWrapper';
import ScrollContainer from './components/ScrollContainer';
import MainButton from './components/ui/MainButton';

import { theme } from '../styles/theme';

export default function CheckoutScreenNative() {
    const router = useRouter();
    const { confirmPayment } = useStripe(); // prêt pour un flow plus complet

    // Sélecteurs Zustand
    const cartItems = useCartStore((s) => s.cartItems);
    const validateCart = useCartStore((s) => s.validateCart);
    const cartErrors = useCartStore((s) => s.errors);
    const offersByEvent = useOfferStore((s) => s.offersByEvent);

    const [loading, setLoading] = useState(false);

    // Calcul du total
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
            // Appel au backend pour valider le panier et générer tes tickets mock
            await validateCart();

            Alert.alert(
                'Paiement réussi',
                `Montant payé : ${priceTotal.toFixed(2)} €`,
                [
                    {
                        text: 'Continuer',
                        onPress: () => router.replace('/confirmation'),
                    },
                ],
            );
        } catch (e: any) {
            Alert.alert(
                'Erreur de paiement',
                e.message || 'Une erreur est survenue',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <Text style={styles.title}>Validation et paiement</Text>

                //Récapitulatif du panier
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

                //Messages d’erreur
                {cartErrors.map((err) => (
                    <Text key={err} style={styles.errorText}>
                        {err}
                    </Text>
                ))}

                //Formulaire Stripe natif
                <Text style={styles.subtitle}>Informations de paiement</Text>
                <CardField
                    postalCodeEnabled
                    placeholders={{ number: '•••• •••• •••• ••••' }}
                    style={styles.cardField}
                />

                //Bouton Payer
                <View style={styles.buttonContainer}>
                    <MainButton
                        label={loading ? 'Paiement en cours...' : 'Payer'}
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
    cardField: {
        height: 50,
        marginVertical: theme.spacing.md,
    },
    buttonContainer: {
        marginTop: theme.spacing.lg,
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    actionColumn: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
});
*/
