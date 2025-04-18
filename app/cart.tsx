import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

//stores
import { useCartStore } from '@/stores/cartStore';
import { OFFER_DEFINITIONS } from '@/stores/offerStore';

//Style
import { theme } from '../styles/theme';

//Components
import MainButton from './components/MainButton';

export default function CartScreen() {
    //Cart store constants
    const { cartItems, updateCart, removeItem, getTotalPrice } = useCartStore();

    //expo thingy
    const router = useRouter();

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: theme.colors.page }}
        >
            <Text style={styles.title}>Votre panier</Text>
            {cartItems.length === 0 ? (
                <Text style={styles.empty}>Votre panier est vide.</Text>
            ) : (
                <>
                    {cartItems.map((item) => {
                        const offer = OFFER_DEFINITIONS[item.offerType];
                        const totalLine = offer.price * item.quantity;

                        return (
                            <View key={item.id} style={styles.item}>
                                <View style={styles.row}>
                                    <Text style={styles.label}>
                                        {item.eventTitle}
                                    </Text>
                                    <Text style={styles.label}>
                                        {offer.label}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.quantityControls}>
                                        <MainButton
                                            label="-"
                                            onPress={() =>
                                                updateCart(
                                                    item.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            style={styles.qtyBtn}
                                        />
                                        <Text style={styles.quantityText}>
                                            {item.quantity}
                                        </Text>
                                        <MainButton
                                            label="+"
                                            onPress={() =>
                                                updateCart(
                                                    item.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                            style={styles.qtyBtn}
                                        />
                                    </View>
                                    <Text style={styles.price}>
                                        {totalLine.toFixed(2)} €
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
                    <View style={styles.actions}>
                        <MainButton
                            label="Valider le panier et payer"
                            onPress={() => {
                                /*futur paiement*/
                            }}
                        ></MainButton>
                        <MainButton
                            label="Continuer mes achats"
                            onPress={() => router.back()}
                        ></MainButton>
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
    },
    empty: {
        fontSize: 16,
        color: theme.colors.secondaryText,
    },
    item: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.md,
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
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    quantityText: {
        fontSize: 16,
        color: theme.colors.text,
        minWidth: 24,
        textAlign: 'center',
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
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: theme.spacing.lg,
        color: theme.colors.primary,
    },
    actions: {
        marginTop: theme.spacing.md,
        gap: theme.spacing.sm,
        width: '100%',
    },
    qtyBtn: {
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
});
