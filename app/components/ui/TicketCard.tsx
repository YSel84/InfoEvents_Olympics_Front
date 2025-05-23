import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../styles/theme';
import MainButton from './MainButton';

export type TicketDto = {
    ticketId: number;
    eventId: number;
    eventTitle: string;
    eventDateTime: string;
    qrHash: string;
    used: boolean;
    orderId: number;
};

interface TicketCardProps {
    ticket: TicketDto;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    const router = useRouter();

    const goToDetail = () => {
        router.push(`/tickets/${ticket.ticketId}`);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/tickets/${ticket.ticketId}`)}
        >
            <Text style={styles.title}>{ticket.eventTitle}</Text>
            <Text style={styles.meta}>
                {new Date(ticket.eventDateTime).toLocaleDateString()} — Réf. #
                {ticket.ticketId}
            </Text>
            <Text style={styles.meta}>Commande #{ticket.orderId}</Text>
            {ticket.used && <Text style={styles.used}>Déjà utilisé</Text>}
            <View style={styles.buttonWrapper}>
                <MainButton
                    label="Afficher"
                    onPress={goToDetail}
                    size="small"
                    fullWidth={false}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    meta: {
        fontSize: 14,
        color: theme.colors.secondaryText,
        marginTop: theme.spacing.xs,
    },
    used: {
        marginTop: theme.spacing.xs,
        color: theme.colors.danger,
        fontWeight: 'bold',
    },
    buttonWrapper: {
        marginTop: theme.spacing.md,
        alignItems: 'center',
    },
});
