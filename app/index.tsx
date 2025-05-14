import { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    useWindowDimensions,
    ActivityIndicator,
    ViewStyle,
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
import { gridContainer, gridItem } from '@/styles/common';

//API — correction du chemin : depuis app/index.tsx vers app/lib/_eventService
import { fetchEvents, Event } from './lib/_eventService';
import { useBreakpoint } from './hooks/useBreakpoints';

export default function Index() {
    const router = useRouter();
    const bp = useBreakpoint();
    const { width } = useWindowDimensions();

    // Hauteur du hero selon la largeur
    const height =
        width > theme.layout.breakpoints.lg
            ? 320
            : width > theme.layout.breakpoints.md
              ? 280
              : 220;

    // Largeur en grille
    let itemWidth = '100%';
    if (bp === 'md') itemWidth = '48%';
    if (bp === 'lg' || bp === 'xl') itemWidth = '32%';

    // État events/loading/error
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents()
            .then(setEvents)
            .catch(() => setError('Erreur au chargement des événements'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <WebWrapper>
            <ScrollContainer>
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
                        Événements à la une
                    </Text>

                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    ) : error ? (
                        <Text style={{ color: theme.colors.danger }}>
                            {error}
                        </Text>
                    ) : (
                        <View style={gridContainer}>
                            {events
                                .filter((e) => e.featured)
                                .map((e) => (
                                    <View
                                        key={e.id}
                                        style={[
                                            gridItem,
                                            {
                                                flexBasis: itemWidth,
                                            } as ViewStyle,
                                        ]}
                                    >
                                        <Card
                                            title={e.title}
                                            eventDateTime={e.eventDateTime}
                                            location={e.location}
                                            imageUrl={e.imageUrl}
                                        >
                                            <MainButton
                                                label="Informations et billets"
                                                onPress={() =>
                                                    router.push(
                                                        `/events/${e.id}`,
                                                    )
                                                }
                                            />
                                        </Card>
                                    </View>
                                ))}
                        </View>
                    )}
                </View>
            </ScrollContainer>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    heroSection: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.colors.page,
    },

    featured: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.page,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.buttonBackground,
    },
});
/**
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
import 'react-native-get-random-values';

//components
import Card from './components/ui/Card';
import WebWrapper from './components/WebWrapper';
import ScrollContainer from './components/ScrollContainer';
import MainButton from './components/ui/MainButton';

//Styles & Data
import { theme } from '../styles/theme';
import { gridContainer, gridItem } from '@/styles/common';

//API
import { fetchEvents, Event } from './lib/_eventService';
import { useBreakpoint } from './hooks/useBreakpoints';

export default function Index() {
    const router = useRouter();
    const bp = useBreakpoint();

    //layout
    const { width } = useWindowDimensions();
    //const height = width > 1024 ? 320 : width > 768 ? 280 : 220;
    const height =
        width > theme.layout.breakpoints.lg
            ? 320
            : width > theme.layout.breakpoints.md
              ? 280
              : 220;
    //Grid item width
    let itemWidth = '100%';
    if (bp === 'md') itemWidth = '48%';
    if (bp === 'lg' || bp === 'xl') itemWidth = '32%';

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
        <WebWrapper>
            <ScrollContainer>
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
                        <View style={gridContainer}>
                            {events
                                .filter((e) => e.featured)
                                .map((e) => (
                                    <View
                                        key={e.id}
                                        style={[
                                            gridItem,
                                            {
                                                flexBasis: itemWidth,
                                            } as import('react-native').ViewStyle,
                                        ]}
                                    >
                                        <Card
                                            //key={e.id}
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
                                    </View>
                                ))}
                        </View>
                    )}
                </View>
            </ScrollContainer>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    heroSection: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.colors.page,
    },

    featured: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.page,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.buttonBackground,
    },
});
*/
