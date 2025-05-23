import 'react-native-get-random-values';
import { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    useWindowDimensions,
    ActivityIndicator,
    ViewStyle,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

//components
import Card from './components/ui/Card';
import WebWrapper from './components/utils/WebWrapper';
import ScrollContainer from './components/ui/ScrollContainer';
import MainButton from './components/ui/MainButton';

//Styles & Data
import { theme } from '../styles/theme';
import { gridContainer, gridItem } from '@/styles/common';
import { Ionicons } from '@expo/vector-icons';

//API  & stores
import { fetchEvents, Event } from './lib/_eventService';
import { useBreakpoint } from './hooks/useBreakpoints';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
    const router = useRouter();
    const bp = useBreakpoint();
    const { width } = useWindowDimensions();

    //roles
    const user = useAuthStore((s) => s.user);
    const roles = useAuthStore((s) => s.roles);
    const isEmployee = user && roles.includes('EMPLOYEE');

    // État events/loading/error
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    useEffect(() => {
        fetchEvents()
            .then(setEvents)
            .catch(() => setError('Erreur au chargement des événements'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <WebWrapper>
            <ScrollContainer>
                {/* HERO */}
                <View style={[styles.heroSection, { height }]}>
                    <Image
                        source={require('../assets/images/hero-bg.jpg')}
                        style={StyleSheet.absoluteFill}
                        alt="Eiffel tower with olympic rings"
                        contentFit="cover"
                    />
                </View>

                {/* SECTION PRINCIPALE */}
                {isEmployee ? (
                    // QR icon & button
                    Platform.OS === 'web' ? (
                        <Text style={styles.empMessage}>
                            Pour scanner les billets, utilisez l'application
                            mobile.
                        </Text>
                    ) : (
                        <View style={styles.employeeScanContainer}>
                            <Ionicons
                                name="qr-code-outline"
                                size={120}
                                color={theme.colors.primary}
                            />
                            <MainButton
                                label="Scanner un billet"
                                onPress={() => router.push('/scan')}
                                style={styles.employeeScanButton}
                            />
                        </View>
                    )
                ) : (
                    // vue normale : événements à la une
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
                )}
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
    empMessage: {
        textAlign: 'center',
        marginVertical: 16,
        color: theme.colors.secondaryText,
        fontSize: 16,
    },
    scanButton: {
        alignSelf: 'center',
        marginVertical: 16,
    },
    employeeScanContainer: {
        alignItems: 'center',
        padding: 32,
    },
    employeeScanButton: {
        marginTop: 24,
        width: '60%',
    },
});
