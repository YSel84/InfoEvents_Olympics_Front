import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
//Datas & style
import { events } from '../../mock/event';
import { theme } from '../../styles/theme';
import { useCartStore } from '@/stores/cartStore';
import { useOfferStore } from '@/stores/offerStore';
//components
import MainButton from '../components/MainButton';
import WebWrapper from '../components/WebWrapper';
import TicketOfferModal from '../components/TicketOffersModal';
import WebOfferDrawer from '../components/WebOfferDrawer';

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    //Modal&Drawer
    const [showOfferPanel, setShowOfferPanel] = useState(false);

    const event = events.find((e) => e.id === id);
    //Offer & cart store
    const { quantities, reset } = useOfferStore();
    const { addToCart } = useCartStore();

    //No event available
    if (!event) {
        return (
            <WebWrapper>
                <View
                    style={[
                        styles.container,
                        { backgroundColor: theme.colors.page },
                    ]}
                >
                    <Text style={{ color: theme.colors.text }}>
                        Evènement introuvable
                    </Text>
                </View>
            </WebWrapper>
        );
    }

    const handleValidate = () => {
        (['Solo', 'Duo', 'Familiale'] as const).forEach((offerType) => {
            const quantity = quantities[offerType];
            if (quantity > 0) {
                addToCart({
                    eventId: id as string,
                    eventTitle: event.title,
                    offerType,
                    quantity,
                });
            }
        });
    };

    reset();
    setShowOfferPanel(false);

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
                    <Text style={styles.title}>{event.title}</Text>
                    <Text style={styles.subtitle}>{event.location}</Text>
                    <Text style={styles.subtitle}>{event.time}</Text>
                    <Text style={styles.description}>{event.description}</Text>
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
