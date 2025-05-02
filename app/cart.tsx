import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

//stores
import { useCartStore } from '@/stores/cartStore';
import { OFFER_DEFINITIONS } from '@/stores/offerStore';

//Style
import { theme } from '../styles/theme';
import { cardStyle } from '../styles/common';

//Components
import WebWrapper from './components/WebWrapper';
import MainButton from './components/MainButton';
import QuantityControls from './components/QuantityControls';
import ActionGroup from './components/ActionGroup';

export default function CartScreen() {
    //Cart store constants
    const { cartItems, updateCart, removeItem, getTotalPrice } = useCartStore();

    //expo thingy
    const router = useRouter();

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
                            const offer = OFFER_DEFINITIONS[item.offerType];
                            const totalLine = (
                                offer.price * item.quantity
                            ).toFixed(2);

                            return (
                                <View key={item.id} style={styles.item}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>
                                            Votre événement: {item.eventTitle}
                                        </Text>
                                        <Text style={styles.label}>
                                            Offre choisie : {offer.label}
                                        </Text>
                                    </View>
                                    <View style={styles.row}>
                                        <QuantityControls
                                            quantity={item.quantity}
                                            onChange={(q) =>
                                                updateCart(item.id, q)
                                            }
                                        />
                                        <Text style={styles.price}>
                                            {totalLine} €
                                        </Text>
                                    </View>
                                    <MainButton
                                        label="supprimer"
                                        onPress={() => removeItem(item.id)}
                                        style={styles.removeBtn}
                                    ></MainButton>
                                </View>
                            );
                        })}
                        <Text style={styles.total}>
                            Total : {getTotalPrice().toFixed(2)}€
                        </Text>
                        <ActionGroup
                            actions={[
                                {
                                    label: 'Valider le panier et passer au paiement',
                                    onPress: () => {
                                        /*checkout*/
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
        ...cardStyle,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    label: {
        fontSize: 16,
        color: theme.colors.text,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    removeBtn: {
        marginTop: theme.spacing.sm,
        alignSelf: 'flex-end',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: theme.spacing.lg,
        color: theme.colors.primary,
        textAlign: 'center',
    },
});
