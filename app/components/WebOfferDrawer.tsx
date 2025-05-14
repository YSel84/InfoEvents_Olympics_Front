import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import MainButton from './ui/MainButton';
import OfferRow from './ui/OfferRow';
import { useOfferStore, Offer as StoreOffer } from '@/stores/offerStore';
import { theme } from '../../styles/theme';
import { useCartStore } from '@/stores/cartStore';
import { fetchOffersByEvent, Offer as ApiOffer } from '../lib/_eventService';

interface Props {
    eventId: string;
    isOpen: boolean;
    onClose: () => void;
    //onValidate: () => void;
    onValidate: () => Promise<void>;
}

export default function WebOfferDrawer({
    eventId,
    isOpen,
    onClose,
    onValidate,
}: Props) {
    //new
    const {
        offers,
        quantities,
        fetchOffers,
        resetQuantities,
        increment,
        decrement,
    } = useOfferStore();
    /** old
    const quantities = useOfferStore((state) => state.quantities);
    const resetQuantities = useOfferStore((state) => state.resetQuantities);
    const increment = useOfferStore((state) => state.increment);
    const decrement = useOfferStore((state) => state.decrement);

    const [offers, setOffers] = React.useState<StoreOffer[]>([]);
    */

    //const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        if (Platform.OS === 'web' && isOpen) {
            resetQuantities(); //empty to load locally
            //old
            /** setOffers([]);
            fetchOffersByEvent(eventId)
                .then((apiOffers: ApiOffer[]) =>
                    apiOffers.map((ao) => ({
                        offerId: Number(ao.offerId),
                        eventId: Number(eventId),
                        name: ao.name,
                        price: ao.price,
                        stock: ao.stock,
                    })),
                )
                .then(setOffers); */

            //new
            fetchOffers(eventId);
        }
    }, [eventId, isOpen]);

    if (Platform.OS !== 'web' || !isOpen) return null;

    /** 
     const handleValidate = async () => {
        for (const o of offers) {
            const qty = quantities[o.offerId] || 0;
            if (qty > 0) {
                await addToCart(o.offerId, qty);
            }
        }
        onClose();
    };
    */

    return (
        <View style={styles.drawer}>
            <Text style={styles.title}>Offres de billets disponibles</Text>
            {offers.length === 0 ? (
                <Text>Chargement des offres...</Text>
            ) : (
                offers.map((o) => {
                    return (
                        <OfferRow
                            key={o.offerId.toString()}
                            name={o.name}
                            price={o.price}
                            quantity={quantities[o.offerId]}
                            onIncrement={() => {
                                increment(o.offerId);
                            }}
                            onDecrement={() => {
                                decrement(o.offerId);
                            }}
                        />
                    );
                })
            )}
            <View style={styles.actions}>
                <MainButton label="Valider" onPress={onValidate} />
                <MainButton label="Fermer" onPress={onClose} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: 'fixed',
        right: 0,
        top: 0,
        width: 600,
        height: '100%',
        backgroundColor: theme.colors.page,
        padding: theme.spacing.lg,
        borderLeftWidth: 5,
        borderLeftColor: theme.colors.border,
        zIndex: 999,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
        textAlign: 'center',
    },
    actions: {
        marginTop: theme.spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
});
