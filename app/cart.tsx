import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
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
    const {
        initCart,
        cartItems,
        errors,
        validateCart,
        updateCart,
        removeItem,
    } = useCartStore();

    const { offersByEvent, fetchOffers } = useOfferStore();

    const [showLoginModal, setShowLoginModal] = useState(false);

    // Initialize cart (sessionId, cartId, details)
    useEffect(() => {
        initCart();
    }, [initCart]);

    //load offers for current items
    useEffect(() => {
        (async () => {
            const uniqueEventIds = Array.from(
                new Set(cartItems.map((item) => item.eventId)),
            );
            for (const id of uniqueEventIds) {
                await fetchOffers(id.toString());
            }
        })();
    }, [cartItems, fetchOffers]);

    //Compute ttotal
    const priceTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const eventOffers = offersByEvent[item.eventId] ?? [];
            const offer = eventOffers.find((o) => o.offerId === item.offerId);
            const price = offer?.price ?? 0;
            return sum + price * item.quantity;
        }, 0);
    }, [cartItems, offersByEvent]);

    const onValidate = async () => {
        try {
            await validateCart();
            //if ok, payment
            if (errors.length === 0) {
                router.push('/checkout');
            }
        } catch (e: any) {
            if (e.message === 'UNAUTHORIZED') {
                setShowLoginModal(true);
            } else {
                console.error(e);
            }
        }
    };

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
                            const eventOffers =
                                offersByEvent[item.eventId] ?? [];
                            const offer = eventOffers.find(
                                (o) => o.offerId === item.offerId,
                            );
                            const label = offer?.name ?? '-';
                            const price = offer?.price ?? 0;
                            const totalLine = (price * item.quantity).toFixed(
                                2,
                            );

                            return (
                                <View key={item.id} style={styles.item}>
                                    {/* Info Column */}
                                    <View style={styles.infoColumn}>
                                        <Text style={styles.eventTitle}>
                                            {item.eventTitle ||
                                                'Evénement inconnu'}
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
                            Total : {priceTotal.toFixed(2)} €
                        </Text>
                        {/*Error of validation if any */}
                        {errors.map((err) => (
                            <Text key={err} style={styles.errorText}>
                                {err}
                            </Text>
                        ))}
                        <ActionGroup
                            actions={[
                                {
                                    label: 'Valider le panier et passer au paiement',
                                    onPress: onValidate,
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
                {/*Connexion modal for guests */}
                <Modal
                    visible={showLoginModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowLoginModal(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>
                                Connectez-vous ou créez un compte pour confirmer
                                votre commande
                            </Text>
                            <MainButton
                                label="Se connecter"
                                onPress={() => {
                                    setShowLoginModal(false);
                                    router.push({
                                        pathname: '/login',
                                        params: { redirectTo: 'Cart' },
                                    });
                                }}
                            />
                            <View style={{ height: 8 }} />
                            <MainButton
                                label="Créer un compte"
                                onPress={() => {
                                    setShowLoginModal(false);
                                    router.push({
                                        pathname: '/register',
                                        params: { redirectTo: 'Cart' },
                                    });
                                }}
                            />
                        </View>
                    </View>
                </Modal>
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
    },
});
