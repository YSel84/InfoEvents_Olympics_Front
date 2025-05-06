import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
//Components
import Card from './components/ui/Card';
import WebWrapper from './components/WebWrapper';
import ScrollContainer from './components/ScrollContainer';
import MainButton from './components/ui/MainButton';
//Theme & store
import { useEventStore } from '../stores/eventStore';
import { theme } from '../styles/theme';

//API
import { useEffect, useState } from 'react';
import { fetchEvents, Event } from './lib/_eventService';

export default function EventScreen() {
    const router = useRouter();
    const { visibleCount, increaseVisibleCount } = useEventStore();
    const [events, setEvents] = useState<Event[]>([]);

    //loading widget
    const [loading, setLoading] = useState(true);
    //error
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents()
            .then(setEvents)
            .catch(() => setError('Erreur au chargement des événements'))
            .finally(() => setLoading(false));
    }, []);

    //Add more events
    const visibleEvents = events.slice(0, visibleCount);
    const hasMore = visibleCount < events.length;
    const handleLoadMore = () => {
        if (hasMore) {
            increaseVisibleCount();
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollContainer>
            <WebWrapper>
                <Text style={styles.title}>Les épreuves</Text>
                <Text style={styles.text}>
                    Découvrez les événéments disponibles
                </Text>
                <FlatList
                    data={visibleEvents}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card
                            title={item.title}
                            event_datetime={item.event_datetime}
                            location={item.location}
                            image_url={item.image_url}
                        >
                            <MainButton
                                label="Informations et billets"
                                onPress={() =>
                                    router.push(`/events/${item.id}` as any)
                                }
                            />
                        </Card>
                    )}
                    ListFooterComponent={() =>
                        hasMore ? (
                            <MainButton
                                label="Charger plus d'épreuves"
                                onPress={handleLoadMore}
                            />
                        ) : (
                            <Text style={styles.footerText}>
                                Il n'y a plus d'événements à afficher
                            </Text>
                        )
                    }
                />
            </WebWrapper>
        </ScrollContainer>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: theme.colors.danger,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.primary,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        color: theme.colors.primary,
    },
    location: {
        fontSize: 14,
        marginBottom: 8,
    },
    footerText: {
        textAlign: 'center',
        padding: 16,
        color: theme.colors.secondaryText,
    },
});
