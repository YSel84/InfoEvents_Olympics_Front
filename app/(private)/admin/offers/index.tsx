import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import WebWrapper from '../../../components/utils/WebWrapper';
import ScrollContainer from '../../../components/ui/ScrollContainer';
import MainButton from '@/app/components/ui/MainButton';
import { Offer } from '../../../types';
import * as offerService from '../../../lib/admin/_offerService';
import * as eventService from '@/app/lib/_eventService';
import { Picker } from '@react-native-picker/picker';
import { theme } from '@/styles/theme';

export default function AdminOfferList() {
    const router = useRouter();
    const [allOffers, setAllOffers] = useState<Offer[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
    const [eventsMap, setEventsMap] = useState<Record<number, string>>({});
    const [events, setEvents] = useState<{ id: number; title: string }[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination states
    const pageSize = 10; // number of items per page
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        (async () => {
            try {
                // Fetch offers and events in parallel
                const [offres, evts] = await Promise.all([
                    offerService.fetchAllOffers(),
                    eventService.fetchEvents(),
                ]);
                setAllOffers(offres);
                // build event map
                const map: Record<number, string> = {};
                evts.forEach((e) => {
                    map[e.id] = e.title;
                });
                setEventsMap(map);
                // store events for filter dropdown
                setEvents(evts.map((e) => ({ id: e.id, title: e.title })));
                // initial full list
                setFilteredOffers(offres);
            } catch (err: any) {
                setError(err.message || 'Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // When filter changes, update filteredOffers and reset to first page
    useEffect(() => {
        const filtered =
            selectedEventId === ''
                ? allOffers
                : allOffers.filter(
                      (o) => o.eventId === parseInt(selectedEventId, 10),
                  );
        setFilteredOffers(filtered);
        setPage(0);
    }, [selectedEventId, allOffers]); // recalc when filter or offers change

    // Calculate pagination
    const totalPages = Math.ceil(filteredOffers.length / pageSize);
    const currentItems = filteredOffers.slice(
        page * pageSize,
        (page + 1) * pageSize,
    );

    const renderItem = ({ item }: { item: Offer }) => {
        const eventTitle = eventsMap[item.eventId] ?? '-';
        return (
            <View style={styles.card}>
                <Text style={styles.title}>
                    {eventTitle} : {item.name}
                </Text>
                <View style={styles.actions}>
                    <MainButton
                        label="Détails"
                        onPress={() =>
                            router.push(`/admin/offers/${item.offerId}`)
                        }
                        size="small"
                    />
                </View>
            </View>
        );
    };

    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Gestion des Offres</Text>
                    <MainButton
                        label="Nouvelle offre"
                        onPress={() => router.push('/admin/offers/new')}
                    />
                </View>

                {/* Filter by Event */}
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>
                        Filtrer par événement :
                    </Text>
                    <Picker
                        selectedValue={selectedEventId}
                        onValueChange={(val) =>
                            setSelectedEventId(val as string)
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="Tous les événements" value="" />
                        {events.map((ev) => (
                            <Picker.Item
                                key={ev.id}
                                label={ev.title}
                                value={ev.id.toString()}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Content */}
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <>
                        <FlatList
                            data={currentItems}
                            renderItem={renderItem}
                            keyExtractor={(o) => o.offerId.toString()}
                            contentContainerStyle={styles.list}
                        />

                        {/* Pagination Controls */}
                        <View style={styles.pagination}>
                            <MainButton
                                label="Précédent"
                                onPress={() =>
                                    setPage((p) => Math.max(p - 1, 0))
                                }
                                size="small"
                            />
                            <Text style={styles.pageInfo}>
                                Page {page + 1} / {totalPages || 1}
                            </Text>
                            <MainButton
                                label="Suivant"
                                onPress={() =>
                                    setPage((p) =>
                                        Math.min(p + 1, totalPages - 1),
                                    )
                                }
                                size="small"
                            />
                        </View>
                    </>
                )}
            </ScrollContainer>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    filterContainer: { marginBottom: 16 },
    filterLabel: { fontSize: 16, marginBottom: 4, color: theme.colors.primary },
    picker: {
        backgroundColor: theme.colors.secondaryText,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    list: { paddingBottom: 32 },
    card: {
        backgroundColor: theme.colors.surface,
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.secondaryText,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    pageInfo: { marginHorizontal: 12, color: theme.colors.primary },
    error: { color: 'red', textAlign: 'center' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
});
