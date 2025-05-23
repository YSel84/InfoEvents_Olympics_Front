import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../../styles/theme';
import { useCartStore } from '@/stores/cartStore';
import { useOfferStore } from '@/stores/offerStore';
import MainButton from '../components/ui/MainButton';
import WebWrapper from '../components/utils/WebWrapper';
import TicketOffersModal from '../components/TicketOffersModal';
import WebOfferDrawer from '../components/WebOfferDrawer';
import { fetchEventById } from '../lib/_eventService';
import { FormattedDate } from '../components/utils/FormattedDate';
import type { Event } from '../types';

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showOfferPanel, setShowOfferPanel] = useState(false);

    const { offers, quantities, resetQuantities } = useOfferStore();
    const addToCart = useCartStore((s) => s.addToCart);

    //Load event

    useEffect(() => {
        if (typeof id === 'string') {
            fetchEventById(id)
                .then(setEvent)
                .catch(() => setError('Événement introuvable'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // validate choices made in Offer drawer/modal
    const handleValidate = async () => {
        for (const o of offers) {
            const qty = quantities[o.offerId] || 0;
            if (qty > 0) {
                await addToCart(o.offerId, qty);
            }
        }
        resetQuantities();
        setShowOfferPanel(false);
    };

    // Close modal
    const closePanel = () => {
        resetQuantities();
        setShowOfferPanel(false);
    };

    return (
        <WebWrapper>
            <View style={styles.slideContainer}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    style={{ backgroundColor: theme.colors.page }}
                >
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    ) : error || !event ? (
                        <Text style={styles.errorText}>
                            {error || 'Événement introuvable'}
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.title}>{event.title}</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={styles.subtitle}>
                                    {event.location}
                                </Text>
                                <Text style={styles.dot}>•</Text>
                                <FormattedDate value={event.eventDateTime} />
                            </View>
                            <Text style={styles.description}>
                                {event.description}
                            </Text>
                            <View style={styles.buttonGroup}>
                                <MainButton
                                    label="Voir les offres de billets"
                                    onPress={() => setShowOfferPanel(true)}
                                />
                                <MainButton
                                    label="Retour"
                                    onPress={() => router.back()}
                                />
                            </View>
                        </>
                    )}
                </ScrollView>
            </View>

            {/* Drawer pour le web */}
            <WebOfferDrawer
                eventId={typeof id === 'string' ? id : ''}
                isOpen={showOfferPanel}
                onClose={closePanel}
                onValidate={handleValidate}
            />

            {/* Modal pour le mobile */}
            <TicketOffersModal
                eventId={typeof id === 'string' ? id : ''}
                isVisible={Platform.OS !== 'web' && showOfferPanel}
                onClose={closePanel}
                onValidate={handleValidate}
            />
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    slideContainer: {
        flex: 1,
        transitionDuration: '300ms',
        transitionProperty: 'transform',
    },
    container: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        gap: theme.spacing.md,
        backgroundColor: theme.colors.page,
        minHeight: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text,
    },
    description: {
        fontSize: 16,
        marginTop: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.text,
    },
    buttonGroup: {
        marginTop: theme.spacing.lg,
        //width: '100%',
        gap: theme.spacing.md,
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
    },
    dot: {
        marginHorizontal: theme.spacing.sm,
        color: theme.colors.text,
    },
});
