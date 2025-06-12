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
import { Event } from '../../../types';
import * as eventService from '../../../lib/admin/_eventService';
import { theme } from '@/styles/theme';

export default function AdminEventList() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await eventService.fetchAllEvents();
                setEvents(data);
            } catch (err: any) {
                setError(err.message || 'Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const renderItem = ({ item }: { item: Event }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.actions}>
                <MainButton
                    label="Détails"
                    onPress={() => router.push(`/admin/events/${item.id}`)}
                    size="small"
                />
            </View>
        </View>
    );

    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Gestion des Événements</Text>
                    <MainButton
                        label="Nouvel événement"
                        onPress={() => router.push('/admin/events/new')}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                        keyExtractor={(e) => e.id.toString()}
                        contentContainerStyle={styles.list}
                    />
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
    heading: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
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
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
    error: { color: 'red', textAlign: 'center' },
});
