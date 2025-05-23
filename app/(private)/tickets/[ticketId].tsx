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
import MainButton from '../../components/ui/MainButton';
import WebWrapper from '../../components/utils/WebWrapper';
import ScrollContainer from '../../components/ui/ScrollContainer';
import { theme } from '../../../styles/theme';
import { fetchWithAuth } from '../../lib/_api';

interface TicketDto {
    ticketId: number;
    eventTitle: string;
    eventDateTime: string;
    qrHash: string;
    used: boolean;
    orderId: number;
}

export default function TicketDetailScreen() {
    const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
    const router = useRouter();
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
                setTicket(await res.json());
            } catch (e) {
                console.error(e);
                setError('Impossible de charger le billet');
            } finally {
                setLoading(false);
            }
        })();
    }, [ticketId]);

    const content = loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
    ) : error ? (
        <Text style={styles.error}>{error}</Text>
    ) : (
        ticket && (
            <View style={styles.card}>
                <Text style={styles.title}>{ticket.eventTitle}</Text>
                <Text style={styles.subtitle}>
                    {new Date(ticket.eventDateTime).toLocaleString()}
                </Text>
                <View style={styles.qrContainer}>
                    <QRCode value={ticket.qrHash} size={256} />
                </View>
                <Text style={styles.info}>
                    Billet #{ticket.ticketId} — Commande #{ticket.orderId}
                </Text>
                {ticket.used && <Text style={styles.used}>Déjà utilisé</Text>}
                <MainButton
                    label="Mes autres billets"
                    onPress={() => router.push('/tickets')}
                    style={{ marginTop: theme.spacing.lg }}
                />
            </View>
        )
    );

    const wrapped = (
        <ScrollContainer contentContainerStyle={styles.scrollContent}>
            {content}
        </ScrollContainer>
    );

    return Platform.OS === 'web' ? <WebWrapper>{wrapped}</WebWrapper> : wrapped;
}

const styles = StyleSheet.create({
    scrollContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.page,
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
        textAlign: 'center',
    },
    subtitle: {
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    qrContainer: {
        marginVertical: theme.spacing.lg,
    },
    info: {
        color: theme.colors.text,
        textAlign: 'center',
    },
    used: {
        marginTop: theme.spacing.sm,
        color: theme.colors.danger,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    error: {
        color: theme.colors.danger,
        textAlign: 'center',
    },
});
