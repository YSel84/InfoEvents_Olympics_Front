import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainButton from './MainButton';
import { TicketDto } from '../../types';
import { theme } from '../../../styles/theme';
import { useRouter } from 'expo-router';

interface Props {
    ticket: TicketDto;
}

export default function TicketCard({ ticket }: Props) {
    const router = useRouter();

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{ticket.eventTitle}</Text>
            <Text style={styles.eventDate}>
                {new Date(ticket.eventDateTime).toLocaleString()}
            </Text>
            <MainButton
                label="Afficher le QR code"
                onPress={() => router.push(`/tickets/${ticket.ticketId}`)}
                size="small"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        marginVertical: theme.spacing.sm,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },

    header: {
        marginBottom: theme.spacing.sm,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    eventDate: {
        fontSize: 14,
        color: theme.colors.secondaryText,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderId: {
        fontSize: 12,
        color: theme.colors.secondaryText,
    },
    used: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    usedTrue: {
        color: theme.colors.danger,
    },
});
