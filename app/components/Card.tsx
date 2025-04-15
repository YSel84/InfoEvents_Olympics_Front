import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';

import MainButton from './MainButton';

export default function Card({
    id,
    title,
    imageSource,
}: {
    id: string;
    title: string;
    imageSource: string;
}) {
    const router = useRouter();
    return (
        <View style={styles.card}>
            <Image
                source={imageSource}
                style={styles.cardImage}
                contentFit="cover"
            />
            <Text style={styles.cardTitle}>{title}</Text>
            <MainButton
                label="Informations et billets"
                onPress={() => router.push(`/events/${id}` as any)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexShrink: 1,
        width: 350,
        maxWidth: '90%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 4,
        marginBottom: theme.spacing.sm,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.primary,
        textAlign: 'center',
    },
});
