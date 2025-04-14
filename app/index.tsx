import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Card from './components/Card';
import { events } from './mock/event';
import { theme } from './styles/theme';

export default function Index() {
    const { width } = useWindowDimensions();
    const height = width > 1024 ? 320 : width > 768 ? 280 : 220;

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: theme.colors.surface }}
        >
            <View style={[styles.heroSection, { height }]}>
                <Image
                    source={require('../assets/images/hero-bg.jpg')}
                    style={StyleSheet.absoluteFill}
                    alt="Eiffel tower with olympic rings"
                    contentFit="cover"
                />
            </View>

            <View style={styles.featured}>
                <Text style={styles.featuredTitle}>Evénements à la une</Text>
                <View style={styles.cardGrid}>
                    {events.map((e) => (
                        <Card
                            key={e.id}
                            id={e.id}
                            title={e.title}
                            imageSource={require('../assets/images/placeholder.png')}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
    },
    heroSection: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },

    featured: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
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
    },
});
