import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

import WebWrapper from '../../components/WebWrapper';
import { theme } from '../../../styles/theme';
import { fetchWithAuth } from '../../lib/_api';

interface TicketDto {
    ticketId: number;
    eventId: number;
    eventTitle: string;
    eventDateTime: string;
    qrHash: string;
    used: boolean;
    orderId: number;
}

export default function TicketDetailScreen() {
    const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
    const [ticket, setTicket] = useState<TicketDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ticketId) return;
        (async () => {
            try {
                const res = await fetchWithAuth(`/tickets/${ticketId}`, {
                    method: 'GET',
                });
                if (!res.ok) throw new Error(`Statut ${res.status}`);
                const data = (await res.json()) as TicketDto;
                setTicket(data);
            } catch (e: any) {
                console.error(e);
                setError('Impossible de charger le QR code');
            } finally {
                setLoading(false);
            }
        })();
    }, [ticketId]);

    const content = (() => {
        if (loading)
            return (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            );
        if (error) return <Text style={styles.error}>{error}</Text>;
        if (!ticket) return null;

        return (
            <View style={styles.card}>
                <Text style={styles.title}>{ticket.eventTitle}</Text>
                <Text style={styles.subtitle}>
                    {new Date(ticket.eventDateTime).toLocaleString()}
                </Text>
                <View style={styles.qrContainer}>
                    {Platform.OS === 'web' ? (
                        <QRCode value={ticket.qrHash} size={256} />
                    ) : (
                        <QRCode value={ticket.qrHash} size={256} />
                    )}
                </View>
                <Text style={styles.info}>
                    Billet #{ticket.ticketId} — Commande #{ticket.orderId}
                </Text>
                {ticket.used && <Text style={styles.used}>Déjà utilisé</Text>}
            </View>
        );
    })();

    return Platform.OS === 'web' ? (
        <WebWrapper>
            <View style={styles.webInner}>{content}</View>
        </WebWrapper>
    ) : (
        <View style={styles.container}>{content}</View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.page,
        alignItems: 'center',
        justifyContent: 'center',
    },
    webInner: {
        padding: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.md,
    },
    qrContainer: {
        marginVertical: theme.spacing.lg,
    },
    info: {
        color: theme.colors.text,
    },
    used: {
        marginTop: theme.spacing.sm,
        color: theme.colors.danger,
        fontWeight: 'bold',
    },
    error: {
        color: theme.colors.danger,
        textAlign: 'center',
    },
});
