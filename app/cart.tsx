import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// stores
import { useCartStore } from '@/stores/cartStore';
import { useOfferStore } from '@/stores/offerStore';

// Style & components
import { theme } from '../styles/theme';
import WebWrapper from './components/WebWrapper';
import MainButton from './components/ui/MainButton';
import QuantityControls from './components/ui/QuantityControls';
import ActionGroup from './components/ui/ActionGroup';

export default function CartScreen() {
    const router = useRouter();

    // Cart and offers stores
    const { cartItems, updateCart, removeItem, getTotalPrice } = useCartStore();
    const { offers, fetchOffers } = useOfferStore();

    // Load offers data for all events in cart
    useEffect(() => {
        const eventIds = Array.from(
            new Set(cartItems.map((item) => item.eventId)),
        );
        eventIds.forEach((id) => fetchOffers(id));
    }, [cartItems, fetchOffers]);

    return (
        <WebWrapper>
            <ScrollView
                contentContainerStyle={styles.container}
                style={{ backgroundColor: theme.colors.page }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Votre panier</Text>

                {cartItems.length === 0 ? (
                    <Text style={styles.empty}>Votre panier est vide.</Text>
                ) : (
                    <>
                        {cartItems.map((item) => {
                            // Lookup offer details
                            const offer = offers.find(
                                (o) => o.offerId === item.offerId,
                            );
                            const label = offer?.name ?? '';
                            const price = offer?.price ?? 0;
                            const totalLine = (price * item.quantity).toFixed(
                                2,
                            );

                            return (
                                <View key={item.id} style={styles.item}>
                                    {/* Info Column */}
                                    <View style={styles.infoColumn}>
                                        <Text style={styles.eventTitle}>
                                            {item.eventTitle}
                                        </Text>
                                        <Text style={styles.offerLabel}>
                                            {label}
                                        </Text>
                                    </View>
                                    {/* Actions Column */}
                                    <View style={styles.actionColumn}>
                                        <Text style={styles.quantityLabel}>
                                            Quantité
                                        </Text>
                                        <QuantityControls
                                            quantity={item.quantity}
                                            onChange={(q) =>
                                                updateCart(item.id, q)
                                            }
                                        />
                                        <Text style={styles.linePrice}>
                                            {totalLine} €
                                        </Text>
                                        <MainButton
                                            label="Supprimer"
                                            onPress={() => removeItem(item.id)}
                                            size="small"
                                            style={styles.removeBtn}
                                        />
                                    </View>
                                </View>
                            );
                        })}

                        <Text style={styles.total}>
                            Total : {getTotalPrice().toFixed(2)} €
                        </Text>

                        <ActionGroup
                            actions={[
                                {
                                    label: 'Valider le panier et passer au paiement',
                                    onPress: () => {
                                        // checkout logic
                                    },
                                    size: 'large',
                                },
                                {
                                    label: 'Continuer mes achats',
                                    onPress: () => router.back(),
                                },
                            ]}
                        />
                    </>
                )}
            </ScrollView>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    empty: {
        fontSize: 16,
        color: theme.colors.secondaryText,
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
        marginBottom: theme.spacing.lg,
    },
    infoColumn: {
        flex: 1,
        paddingRight: theme.spacing.sm,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
    },
    offerLabel: {
        fontSize: 14,
        color: theme.colors.text,
    },
    actionColumn: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    quantityLabel: {
        fontSize: 12,
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.xs,
    },
    linePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginVertical: theme.spacing.xs,
    },
    removeBtn: {
        marginTop: theme.spacing.sm,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: theme.spacing.lg,
        color: theme.colors.primary,
        textAlign: 'center',
    },
});
