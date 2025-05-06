import { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    useWindowDimensions,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

//components
import Card from './components/ui/Card';
import WebWrapper from './components/WebWrapper';
import ScrollContainer from './components/ScrollContainer';
import MainButton from './components/ui/MainButton';

//Styles & Data
import { theme } from '../styles/theme';

//API
import { fetchEvents, Event } from './lib/_eventService';

export default function Index() {
    const router = useRouter();
    //layout
    const { width } = useWindowDimensions();
    const height = width > 1024 ? 320 : width > 768 ? 280 : 220;
    //API stuff
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //state managing for db call
    useEffect(() => {
        fetchEvents()
            .then(setEvents)
            .catch(() => setError('Erreur au chargement des événements'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <ScrollContainer style={{ backgroundColor: theme.colors.page }}>
            <WebWrapper>
                <View style={[styles.heroSection, { height }]}>
                    <Image
                        source={require('../assets/images/hero-bg.jpg')}
                        style={StyleSheet.absoluteFill}
                        alt="Eiffel tower with olympic rings"
                        contentFit="cover"
                    />
                </View>

                <View style={styles.featured}>
                    <Text style={styles.featuredTitle}>
                        Evénements à la une
                    </Text>
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    ) : error ? (
                        <Text style={{ color: 'red' }}>{error}</Text>
                    ) : (
                        <View style={styles.cardGrid}>
                            {events
                                .filter((e) => e.featured)
                                .map((e) => (
                                    <Card
                                        key={e.id}
                                        title={e.title}
                                        event_datetime={e.event_datetime}
                                        location={e.location}
                                        image_url={e.image_url}
                                    >
                                        <MainButton
                                            label="Informations et billets"
                                            onPress={() =>
                                                router.push(
                                                    `/events/${e.id}` as any,
                                                )
                                            }
                                        />
                                    </Card>
                                ))}
                        </View>
                    )}
                </View>
            </WebWrapper>
        </ScrollContainer>
    );
}

const styles = StyleSheet.create({
    heroSection: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },

    featured: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.buttonBackground,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
    },
});
