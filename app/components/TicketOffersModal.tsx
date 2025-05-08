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
        offers, // le tableau dynamique de ton store
        quantities, // record { [offer_id]: number }
        fetchOffers, // charge `offers` & initialise `quantities`
        resetQuantities, // remet à zéro toutes les clés dynamiques
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

    console.log('Offers in modal:', offers);
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
                        console.log(
                            'Rendering row for',
                            o.offerId,
                            'qty:',
                            quantities[o.offerId],
                        );
                        return (
                            <OfferRow
                                key={o.offerId}
                                name={o.name}
                                price={o.price}
                                quantity={quantities[o.offerId]} // bon index
                                onIncrement={() => {
                                    console.log(
                                        'increment modal for',
                                        o.offerId,
                                    );
                                    increment(o.offerId);
                                }}
                                onDecrement={() => {
                                    console.log(
                                        'decrement modal for',
                                        o.offerId,
                                    );
                                    decrement(o.offerId);
                                }}
                            />
                        );
                    })
                )}

                <View style={styles.actions}>
                    <MainButton
                        label="Valider votre choix"
                        onPress={onValidate}
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
