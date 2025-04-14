import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { theme } from '../styles/theme';


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
            <TouchableOpacity
                style={styles.cardButton}
                onPress={() => router.push(`/events/${id}` as any)}
            >
                <Text style={styles.cardButtonText}>
                    Informations et billets
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexShrink: 1,
        width: 350,
        maxWidth:'90%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 4,
        marginBottom: theme.spacing.sm
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.primary,
        textAlign: 'center',
    },
    cardButton: {
        backgroundColor: theme.colors.buttonBackground,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: theme.borderRadius,
    },
    cardButtonText: {
        color: theme.colors.buttonText,
        fontSize: 14,
    },
});
