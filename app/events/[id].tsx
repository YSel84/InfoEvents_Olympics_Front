import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
//Datas & style
import { theme } from '../../styles/theme';
import { useCartStore } from '@/stores/cartStore';
import { useOfferStore } from '@/stores/offerStore';
//components
import MainButton from '../components/MainButton';
import WebWrapper from '../components/WebWrapper';
import TicketOfferModal from '../components/TicketOffersModal';
import WebOfferDrawer from '../components/WebOfferDrawer';
import ScrollContainer from '../components/ScrollContainer';
//API
import { fetchEventById, Event } from '../lib/_eventService';

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    //Error & loading stuff
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //Modal&Drawer
    const [showOfferPanel, setShowOfferPanel] = useState(false);

    //Offer & cart store
    const { quantities, reset } = useOfferStore();
    const { addToCart } = useCartStore();

    //No event available
    useEffect(() => {
        if (typeof id === 'string') {
            fetchEventById(id)
                .then(setEvent)
                .catch(() => setError('Evénement introuvable'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleValidate = () => {
        (['Solo', 'Duo', 'Familiale'] as const).forEach((offerType) => {
            const quantity = quantities[offerType];
            if (quantity > 0 && event) {
                addToCart({
                    eventId: id as string,
                    eventTitle: event.title,
                    offerType,
                    quantity,
                });
            }
        });
        reset();
        setShowOfferPanel(false);
    };

    //If web drawer
    const drawerOffset =
        Platform.OS === 'web' && showOfferPanel
            ? { transform: [{ translateX: -360 }] }
            : {};

    return (
        <WebWrapper>
            <View style={[styles.slideContainer, drawerOffset]}>
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
                        <Text style={{ color: 'red' }}>
                            {error || 'Evénement introuvable'}
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.title}>{event.title}</Text>
                            <Text style={styles.subtitle}>
                                {event.location}
                            </Text>
                            <Text style={styles.subtitle}>{event.date}</Text>
                            <Text style={styles.description}>
                                {event.description}
                            </Text>
                            <View style={styles.buttonGroup}>
                                <MainButton
                                    label="Choisir des billets"
                                    onPress={() => setShowOfferPanel(true)}
                                />
                                <MainButton
                                    label="Fermer"
                                    onPress={() => router.back()}
                                />
                            </View>
                        </>
                    )}
                </ScrollView>
            </View>

            {/*Drawer Web*/}
            <WebOfferDrawer
                isOpen={showOfferPanel}
                onClose={() => setShowOfferPanel(false)}
                onValidate={handleValidate}
            />

            {/*Modal*/}
            <TicketOfferModal
                isVisible={Platform.OS !== 'web' && showOfferPanel}
                onClose={() => setShowOfferPanel(false)}
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
});
