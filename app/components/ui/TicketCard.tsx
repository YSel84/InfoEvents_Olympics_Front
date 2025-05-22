import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { TicketDto } from '../../types';
import { theme } from '../../../styles/theme';

interface Props {
    ticket: TicketDto;
}

export default function TicketCard({ ticket }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
                <Text style={styles.eventDate}>
                    {new Date(ticket.eventDateTime).toLocaleString()}
                </Text>
            </View>

            <View style={styles.qrContainer}>
                {/* Génère le QR code à partir du qrHash */}
                <QRCode value={ticket.qrHash} size={120} />
            </View>

            <View style={styles.footer}>
                <Text style={styles.orderId}>Commande n° {ticket.orderId}</Text>
                <Text style={[styles.used, ticket.used && styles.usedTrue]}>
                    {ticket.used ? 'Utilisé' : 'Valide'}
                </Text>
            </View>
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
    qrContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.md,
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
