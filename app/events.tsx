import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
//Components
import Card from './components/ui/Card';
import WebWrapper from './components/WebWrapper';

import MainButton from './components/ui/MainButton';
//Theme & store
import { useEventStore } from '../stores/eventStore';
import { theme } from '../styles/theme';
import { gridItem } from '@/styles/common';

//API
import { useEffect, useState } from 'react';
import { fetchEvents, Event } from './lib/_eventService';
import { useBreakpoint } from './hooks/useBreakpoints';

export default function EventScreen() {
    const router = useRouter();

    const bp = useBreakpoint();

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

    //layout
    const numCols = bp === 'lg' || bp === 'xl' ? 3 : bp === 'md' ? 2 : 1;
    const renderItem = ({ item }: { item: Event }) => (
        <View
            style={[gridItem, { flexBasis: `${100 / numCols}%` } as ViewStyle]}
        >
            <Card
                title={item.title}
                event_datetime={item.event_datetime}
                location={item.location}
                image_url={item.image_url}
            >
                <MainButton
                    label="Informations et billets"
                    onPress={() => router.push(`/events/${item.id}`)}
                />
            </Card>
        </View>
    );

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
        <WebWrapper>
            <FlatList
                data={visibleEvents}
                numColumns={numCols}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={numCols > 1 && styles.columnWrapper}
                contentContainerStyle={styles.listContainer}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <>
                        <Text style={styles.title}>Les épreuves</Text>
                        <Text style={styles.text}>
                            Découvrez les événements disponibles
                        </Text>
                    </>
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
    footerText: {
        textAlign: 'center',
        padding: 16,
        color: theme.colors.secondaryText,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    listContainer: {
        paddingHorizontal: theme.spacing.sm,
        paddingBottom: theme.spacing.lg,
        backgroundColor: theme.colors.page,
    },
    gridItem: {
        paddingHorizontal: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
});
