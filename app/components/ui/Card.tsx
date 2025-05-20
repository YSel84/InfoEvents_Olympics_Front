import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';

import { theme } from '../../../styles/theme';
import { FormattedDate } from '../utils/FormattedDate';

interface CardProps {
    title: string;
    eventDateTime: string;
    location: string;
    imageUrl?: string;
    children?: React.ReactNode;
}

export default function Card({
    title,
    eventDateTime,
    location,
    imageUrl,
    children,
}: CardProps) {
    //placeholder
    const src = imageUrl
        ? { uri: imageUrl }
        : require('../../../assets/images/placeholder.png');

    return (
        <View style={styles.card}>
            <Image source={src} style={styles.cardImage} contentFit="cover" />

            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <FormattedDate value={eventDateTime} />
                <Text style={styles.location}>{location}</Text>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        // aspect ratio 1:1 for square cards
        aspectRatio: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cardImage: {
        width: '100%',
        flex: 1,
    },
    cardContent: {
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    location: {
        fontSize: 14,
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
});
