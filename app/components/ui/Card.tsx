import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';

import { theme } from '../../../styles/theme';
import { FormattedDate } from '../utils/FormattedDate';

interface CardProps {
    title: string;
    event_datetime: string;
    location: string;
    image_url?: string;
    children?: React.ReactNode;
}

export default function Card({
    title,
    event_datetime,
    location,
    image_url,
    children,
}: CardProps) {
    //placeholder
    const src = image_url
        ? { uri: image_url }
        : require('../../../assets/images/placeholder.png');

    return (
        <View style={styles.card}>
            <Image source={src} style={styles.cardImage} contentFit="cover" />

            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <FormattedDate value={event_datetime} />
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

/*import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
    ViewStyle,
} from 'react-native';
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

export default function Card({
    title,
    event_datetime,
    location,
    image_url,
    children,
}: CardProps) {
    const router = useRouter();
    const { width } = Dimensions.get('window');

    const bpCols =
        width >= theme.layout.breakpoints.lg
            ? 3
            : width >= theme.layout.breakpoints.md
              ? 2
              : 1;
    const cardMargin = theme.spacing.sm;
    const cardWidth = (width - cardMargin * 2 * bpCols) / bpCols;

    return (
        <View style={[styles.card, { width: cardWidth } as ViewStyle]}>
            {image_url && (
                <Image
                    source={{ uri: image_url }}
                    style={[
                        styles.cardImage,
                        {
                            height: cardWidth * 0.6,
                        } as import('react-native').ImageStyle,
                    ]}
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
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        overflow: 'hidden',
        margin: theme.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1.44,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
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
*/
