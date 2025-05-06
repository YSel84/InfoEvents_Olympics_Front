import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { theme } from '../../../styles/theme';
import MainButton from './MainButton';
import { FormattedDate } from '../utils/FormattedDate';

interface CardProps {
    title: string;
    event_datetime: string;
    location: string;
    image_url?: string;
    children?: React.ReactNode;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const isWeb = Platform.OS === 'web';
const CARD_WIDTH = isWeb
    ? width / 3 - CARD_MARGIN * 2
    : width - CARD_MARGIN * 2;

const Card: React.FC<CardProps> = ({
    title,
    event_datetime,
    location,
    image_url,
    children,
}) => {
    const router = useRouter();
    return (
        <View style={[styles.card, { width: CARD_WIDTH }]}>
            {image_url && (
                <Image
                    source={{ uri: image_url }}
                    style={styles.cardImage}
                    contentFit="cover"
                />
            )}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <FormattedDate value={event_datetime} />
                <Text style={styles.location}>{location}</Text>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: CARD_MARGIN,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1.44,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: CARD_WIDTH * 0.6,
    },
    cardContent: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.primary,
    },
    location: {
        fontSize: 14,
        color: theme.colors.secondaryText,
        marginTop: theme.spacing.sm,
    },
});

export default Card;
