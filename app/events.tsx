import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import Toast from 'react-native-toast-message';

//Components
import Card from './components/Card';
import WebWrapper from './components/WebWrapper';
//Theme & store
import { useEventStore } from '../stores/eventStore';
import { theme } from '../styles/theme';

export default function EventScreen() {
    const { visibleCount, increaseVisibleCount } = useEventStore();
    //Placeholders
    const placeholders = Array.from({ length: 24 }, (_, i) => ({
        id: `${i + 30}`,
        title: `Evenement #${i + 1}`,
        imageSrc: require('../assets/images/placeholder.png'),
    }));
    const visibleEvents = placeholders.slice(0, visibleCount);
    const hasMore = visibleCount < placeholders.length;
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
        <WebWrapper>
            <ScrollView style={{ backgroundColor: theme.colors.page }}>
                <Text style={styles.title}>Les événements</Text>
                <Text style={styles.text}>
                    Découvrez les événéments disponibles
                </Text>
                <View style={styles.grid}>
                    {visibleEvents.map((event) => (
                        <Card
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            imageSource={event.imageSrc}
                        />
                    ))}
                </View>

                <View style={styles.loadMore}>
                    <Button
                        title="Charger plus"
                        onPress={handleLoadMore}
                        color={theme.colors.buttonBackground}
                    />
                </View>
                <Toast />
            </ScrollView>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',

        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
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
    },
});
