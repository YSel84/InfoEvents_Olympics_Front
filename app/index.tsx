import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Card from './components/Card';

export default function Index() {
    const { width } = useWindowDimensions();
    const height = width > 1024 ? 320 : width > 768 ? 280 : 220;

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: 'gold' }}
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
                    {[1, 2, 3].map((i) => (
                        <Card
                            key={i}
                            title={`Evènement ${i}`}
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
        paddingBottom: 32,
        backgroundColor: 'gold',
    },
    heroSection: {
        width: '100%',
        position: 'relative',
    },

    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#ddd',
        marginTop: 8,
        textAlign: 'center',
    },
    featured: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
    },
});
