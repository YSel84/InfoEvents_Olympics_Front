import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useTicketStore } from '../../../stores/ticketStore';
import TicketCard from '../../components/ui/TicketCard';
import WebWrapper from '../../components/utils/WebWrapper';
import ScrollContainer from '../../components/ui/ScrollContainer';
import { theme } from '../../../styles/theme';

export default function TicketsScreen() {
    const { tickets, loading, error, fetchTickets, sortOption, setSortOption } =
        useTicketStore();

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // regrouper par événement si besoin
    const ticketsByEvent = tickets.reduce<Record<string, typeof tickets>>(
        (acc, ticket) => {
            const key = ticket.eventTitle;
            if (!acc[key]) acc[key] = [];
            acc[key].push(ticket);
            return acc;
        },
        {},
    );

    const body = (
        <View style={styles.container}>
            {/* sélecteur de tri */}
            <View style={styles.sortContainer}>
                <Text
                    style={[
                        styles.sortOption,
                        sortOption === 'date' && styles.sortOptionActive,
                    ]}
                    onPress={() => setSortOption('date')}
                >
                    Par date
                </Text>
                <Text
                    style={[
                        styles.sortOption,
                        sortOption === 'event' && styles.sortOptionActive,
                    ]}
                    onPress={() => setSortOption('event')}
                >
                    Par événement
                </Text>
            </View>

            {loading && (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            )}
            {error && <Text style={styles.error}>{error}</Text>}

            {!loading && !error && tickets.length === 0 && (
                <Text style={styles.empty}>Vous n'avez aucun billet.</Text>
            )}

            {!loading &&
                !error &&
                tickets.length > 0 &&
                Object.entries(ticketsByEvent).map(
                    ([eventTitle, eventTickets]) => (
                        <View key={eventTitle} style={styles.section}>
                            <Text style={styles.sectionHeader}>
                                {eventTitle}
                            </Text>
                            {eventTickets.map((ticket) => (
                                <TicketCard
                                    key={ticket.ticketId}
                                    ticket={ticket}
                                />
                            ))}
                        </View>
                    ),
                )}
        </View>
    );

    const scrollable = (
        <ScrollContainer contentContainerStyle={styles.contentContainer}>
            {body}
        </ScrollContainer>
    );

    return Platform.OS === 'web' ? (
        <WebWrapper>{scrollable}</WebWrapper>
    ) : (
        scrollable
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.page,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.page,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    error: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginVertical: theme.spacing.md,
    },
    empty: {
        color: theme.colors.secondaryText,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
    },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: theme.spacing.md,
        gap: theme.spacing.md,
    },
    sortOption: {
        fontSize: 16,
        color: theme.colors.secondaryText,
    },
    sortOptionActive: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
