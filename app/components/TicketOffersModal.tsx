import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import MainButton from './ui/MainButton';
import OfferRow from './ui/OfferRow';
import { useOfferStore } from '@/stores/offerStore';
import { theme } from '../../styles/theme';

interface Props {
    eventId: string;
    isVisible: boolean;
    onClose: () => void;
    onValidate: () => void;
}

export default function TicketOffersModal({
    eventId,
    isVisible,
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
        if (isVisible) {
            resetQuantities();
            fetchOffers(eventId);
        }
    }, [isVisible, eventId]);

    const handleValidate = () => {
        onValidate();
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Offres disponibles</Text>
                {offers.length === 0 ? (
                    <Text>Chargement…</Text>
                ) : (
                    offers.map((o) => (
                        <OfferRow
                            key={o.offerId}
                            name={o.name}
                            price={o.price}
                            quantity={quantities[o.offerId]}
                            onIncrement={() => increment(o.offerId)}
                            onDecrement={() => decrement(o.offerId)}
                        />
                    ))
                )}
                <View style={styles.actions}>
                    <MainButton
                        label="Valider votre choix"
                        onPress={handleValidate}
                    />
                    <MainButton label="Fermer" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: theme.colors.page,
        padding: theme.spacing.lg,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
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

/**
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import MainButton from './ui/MainButton';
import OfferRow from './ui/OfferRow';
import { useOfferStore } from '@/stores/offerStore';
import { theme } from '../../styles/theme';

interface Props {
    eventId: string;
    isVisible: boolean;
    onClose: () => void;
    onValidate: () => void;
}

export default function TicketOffersModal({
    eventId,
    isVisible,
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

    // À l’ouverture, on réinitialise et charge la bonne liste d’offres
    useEffect(() => {
        if (isVisible) {
            resetQuantities();
            fetchOffers(eventId);
        }
    }, [isVisible, eventId]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Offres disponibles</Text>

                {offers.length === 0 ? (
                    <Text>Chargement…</Text>
                ) : (
                    offers.map((o) => {
                        return (
                            <OfferRow
                                key={o.offerId}
                                name={o.name}
                                price={o.price}
                                quantity={quantities[o.offerId]}
                                onIncrement={() => increment(o.offerId)}
                                onDecrement={() => decrement(o.offerId)}
                            />
                        );
                    })
                )}

                <View style={styles.actions}>
                    <MainButton
                        label="Valider votre choix"
                        onPress={() => {
                            onValidate();
                            onClose();
                        }}
                    />
                    <MainButton label="Fermer" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: theme.colors.page,
        padding: theme.spacing.lg,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
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
*/
