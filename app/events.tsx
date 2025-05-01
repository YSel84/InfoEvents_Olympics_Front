import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

//Components
import Card from './components/Card';
import WebWrapper from './components/WebWrapper';
import ScrollContainer from './components/ScrollContainer';
import MainButton from './components/MainButton';
//Theme & store
import { useEventStore } from '../stores/eventStore';
import { theme } from '../styles/theme';

//API
import { useEffect, useState } from 'react';
import { fetchEvents, Event } from './lib/_eventService';

export default function EventScreen() {
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
        } else {
            Toast.show({
                type: 'info',
                text1: 'Tous les événements disponibles sont affichés',
            });
        }
    };

    return (
        <ScrollContainer>
            <WebWrapper>
                <Text style={styles.title}>Les événements</Text>
                <Text style={styles.text}>
                    Découvrez les événéments disponibles
                </Text>
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                ) : error ? (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {error}
                    </Text>
                ) : (
                    <>
                        <View style={styles.grid}>
                            {visibleEvents.map((event) => (
                                <Card
                                    key={event.id}
                                    id={event.id}
                                    title={event.title}
                                    imageSource={{ uri: event.image_url }}
                                />
                            ))}
                        </View>
                        <View style={styles.loadMore}>
                            <MainButton
                                label="Charger plus d'événements"
                                onPress={handleLoadMore}
                            />
                        </View>
                    </>
                )}

                <Toast />
            </WebWrapper>
        </ScrollContainer>
    );
}

const styles = StyleSheet.create({
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.md,
        rowGap: theme.spacing.lg,
    },
    loadMore: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
});
