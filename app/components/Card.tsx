import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';

import MainButton from './MainButton';

type Props = {
    id: string;
    title: string;
    imageSource: ImageSource;
};

export default function Card({ id, title, imageSource }: Props) {
    const router = useRouter();
    return (
        <View style={styles.card}>
            <Image
                source={imageSource}
                style={styles.cardImage}
                contentFit="cover"
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <MainButton
                    label="Informations et billets"
                    onPress={() => router.push(`/events/${id}` as any)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Platform.OS === 'web' ? '32%' : '90%',
        aspectRatio: 3 / 3,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.primary,
    },
    cardContent: {
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        alignItems: 'center',
    },
});
