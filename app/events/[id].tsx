import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { events } from '../mock/event';
import { theme } from '../styles/theme';

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const event = events.find((e) => e.id === id);

    if (!event) {
        return (
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
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: theme.colors.page }}
        >
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.subtitle}>{event.location}</Text>
            <Text style={styles.subtitle}>{event.time}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <View style={styles.buttonGroup}>
                <Button
                    title="Choisir des billets"
                    color={theme.colors.primary}
                    onPress={() => {}}
                />
                <Button
                    title="Fermer"
                    color={theme.colors.surface}
                    onPress={() => router.back()}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.secondaryText,
    },
    description: {
        fontSize: 16,
        marginTop: theme.spacing.md,
        textAlign: 'center',
        color: theme.colors.text,
    },
    buttonGroup: {
        marginTop: theme.spacing.lg,
        width: '100%',
        gap: theme.spacing.md,
    },
});
