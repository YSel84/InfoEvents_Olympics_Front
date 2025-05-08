/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { theme } from '../../styles/theme';
import MainButton from './ui/MainButton';
import OfferRow from './ui/OfferRow';

//import { fetchOffersByEvent, Offer } from '../lib/_eventService';

import { useOfferStore } from '@/stores/offerStore';

type Props = {
    eventId: string;
    isOpen: boolean;
    onClose: () => void;
    onValidate: () => void;
};

export default function WebOfferDrawer({
    eventId,
    isOpen,
    onClose,
    onValidate,
}: Props) {
    const { quantities, increment, decrement } = useOfferStore();
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'web' && isOpen) {
            setLoading(true);
            fetchOffersByEvent(eventId)
                .then((fetched) => {
                    console.log('Offers in drawer fetched: ', fetched);
                    setOffers(fetched);
                })
                .finally(() => setLoading(false));
        }
    }, [eventId, isOpen]);

    console.log('Offers in drawer state:', offers);

    if (Platform.OS !== 'web' || !isOpen) return null;

    return (
        <View style={styles.drawer}>
            <Text style={styles.title}>Offres de billets disponibles</Text>
            {loading ? (
                <Text>Chargement des offres...</Text>
            ) : (
                offers.map((o) => {
                    console.log('Rendering drawer row for', o.offerId);
                    return (
                        <OfferRow
                            key={o.offerId}
                            name={o.name}
                            price={o.price}
                            quantity={quantities[o.offer_id]}
                            onIncrement={() => {
                                console.log('increment drawer for', o.offer_id);
                                increment(o.offerId);
                            }}
                            onDecrement={() => {
                                console.log('decrement drawer for', o.offer_id);
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
        gap: theme.spacing.sm,
    },
});*/

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import MainButton from './ui/MainButton';
import OfferRow from './ui/OfferRow';
import { useOfferStore } from '@/stores/offerStore';
import { theme } from '../../styles/theme';

interface Props {
    eventId: string;
    isOpen: boolean;
    onClose: () => void;
    onValidate: () => void;
}

export default function WebOfferDrawer({
    eventId,
    isOpen,
    onClose,
    onValidate,
}: Props) {
    const {
        offers,
        quantities,
        fetchOffers,
        resetQuantities,
        increment,
        decrement,
    } = useOfferStore();

    useEffect(() => {
        if (Platform.OS === 'web' && isOpen) {
            resetQuantities();
            fetchOffers(eventId);
        }
    }, [eventId, isOpen]);

    console.log('Offers in drawer state:', offers);

    if (Platform.OS !== 'web' || !isOpen) return null;

    return (
        <View style={styles.drawer}>
            <Text style={styles.title}>Offres de billets disponibles</Text>
            {offers.length === 0 ? (
                <Text>Chargement des offres...</Text>
            ) : (
                offers.map((o) => {
                    console.log('Rendering drawer row for', o.offerId);
                    return (
                        <OfferRow
                            key={o.offerId}
                            name={o.name}
                            price={o.price}
                            quantity={quantities[o.offerId]}
                            onIncrement={() => {
                                console.log('increment drawer for', o.offerId);
                                increment(o.offerId);
                            }}
                            onDecrement={() => {
                                console.log('decrement drawer for', o.offerId);
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
