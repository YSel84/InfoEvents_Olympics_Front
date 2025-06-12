import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TextInput,
    Switch,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import WebWrapper from '../../../components/utils/WebWrapper';
import ScrollContainer from '../../../components/ui/ScrollContainer';
import MainButton from '@/app/components/ui/MainButton';
import { Event } from '../../../types';
import * as eventService from '../../../lib/admin/_eventService';
import { theme } from '@/styles/theme';
import { FormattedDate } from '@/app/components/utils/FormattedDate';
import { DatePickerField } from '../../../components/ui/DatePicker';

type FormValues = {
    title: string;
    description: string;
    location: string;
    eventDateTime: string;
    imageUrl: string;
    featured: boolean;
};

export default function EventDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const eventId = Number(id);

    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);
    const [editMode, setEditMode] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            location: '',
            eventDateTime: '',
            imageUrl: '',
            featured: false,
        },
    });

    useEffect(() => {
        (async () => {
            try {
                const evts = await eventService.fetchAllEvents();
                const existing = evts.find((e) => e.id === eventId) || null;
                if (!existing) {
                    Alert.alert('Erreur', 'Événement introuvable');
                    router.replace('/admin/events');
                    return;
                }
                setEvent(existing);
                reset({
                    title: existing.title,
                    description: existing.description,
                    location: existing.location,
                    eventDateTime: existing.eventDateTime,
                    imageUrl: existing.imageUrl,
                    featured: existing.featured,
                });
            } catch (err: any) {
                Alert.alert(
                    'Erreur',
                    err.message || 'Impossible de charger l’événement',
                );
                router.replace('/admin/events');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    //delete event

    const doDeleteEvent = async () => {
        try {
            await eventService.deleteEvent(eventId);
            router.replace('/admin/events');
        } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Suppression échouée');
        }
    };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Voulez-vous supprimer cet événement?')) {
                doDeleteEvent();
            }
        } else {
            Alert.alert('Confirmation', 'Supprimer cet événement ?', [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => doDeleteEvent(),
                },
            ]);
        }
    };

    //submit logic
    const onSubmit = async (data: FormValues) => {
        try {
            await eventService.updateEvent(eventId, {
                title: data.title.trim(),
                description: data.description.trim(),
                location: data.location.trim(),
                eventDateTime: data.eventDateTime,
                imageUrl: data.imageUrl.trim(),
                featured: data.featured,
            });
            setLoading(true);
            const refreshed = (await eventService.fetchAllEvents()).find(
                (e) => e.id === eventId,
            )!;
            setEvent(refreshed);
            reset({
                title: refreshed.title,
                description: refreshed.description,
                location: refreshed.location,
                eventDateTime: refreshed.eventDateTime,
                imageUrl: refreshed.imageUrl,
                featured: refreshed.featured,
            });
            setEditMode(false);
        } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Mise à jour échouée');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !event) {
        return (
            <WebWrapper>
                <ScrollContainer contentContainerStyle={styles.center}>
                    <ActivityIndicator size="large" />
                </ScrollContainer>
            </WebWrapper>
        );
    }

    if (!editMode) {
        return (
            <WebWrapper>
                <ScrollContainer contentContainerStyle={styles.container}>
                    <Text style={styles.heading}>Détails de l’événement</Text>

                    <View style={styles.info}>
                        <Text style={styles.label}>Titre :</Text>
                        <Text style={styles.value}>{event.title}</Text>

                        <Text style={styles.label}>Description :</Text>
                        <Text style={styles.value}>{event.description}</Text>

                        <Text style={styles.label}>Date/Heure :</Text>
                        <FormattedDate
                            value={event.eventDateTime}
                            style={styles.value}
                        />

                        <Text style={styles.label}>Lieu :</Text>
                        <Text style={styles.value}>{event.location}</Text>

                        <Text style={styles.label}>Image URL :</Text>
                        <Text style={styles.value}>{event.imageUrl}</Text>

                        <Text style={styles.label}>À la une :</Text>
                        <Text style={styles.value}>
                            {event.featured ? 'Oui' : 'Non'}
                        </Text>
                    </View>

                    <View style={styles.actionsRow}>
                        <MainButton
                            label="Modifier"
                            onPress={() => setEditMode(true)}
                            size="small"
                            style={styles.actionButton}
                        />

                        <MainButton
                            label="Voir offres"
                            onPress={() =>
                                router.push(`/admin/offers?filter=${event.id}`)
                            } // optionnel
                            size="small"
                            style={styles.actionButton}
                        />
                        <MainButton
                            label="Annuler"
                            onPress={() => router.back()}
                            style={[
                                styles.actionButton,
                                { backgroundColor: theme.colors.secondaryText },
                            ]}
                            size="small"
                        />
                        <MainButton
                            label="Supprimer"
                            onPress={handleDelete}
                            size="small"
                            danger
                        />
                    </View>
                </ScrollContainer>
            </WebWrapper>
        );
    }

    // Mode édition
    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Modifier l’événement</Text>

                <Text style={styles.label}>Titre</Text>
                <Controller
                    control={control}
                    name="title"
                    rules={{
                        required: 'Le titre est requis',
                        minLength: {
                            value: 2,
                            message: 'Au moins 2 caractères',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.title && (
                    <Text style={styles.error}>{errors.title.message}</Text>
                )}

                <Text style={styles.label}>Description</Text>
                <Controller
                    control={control}
                    name="description"
                    rules={{
                        required: 'La description est requise',
                        minLength: {
                            value: 5,
                            message: 'Au moins 5 caractères',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                        />
                    )}
                />
                {errors.description && (
                    <Text style={styles.error}>
                        {errors.description.message}
                    </Text>
                )}

                <Text style={styles.label}>Date/Heure (YYYY-MM-DDThh:mm)</Text>
                <Controller
                    control={control}
                    name="eventDateTime"
                    rules={{
                        required: 'La date/heure est requise',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <DatePickerField
                            onChange={onChange}
                            value={value}
                            placeholder="2025-07-14T18:30"
                            includeTime={true}
                        />
                    )}
                />
                {errors.eventDateTime && (
                    <Text style={styles.error}>
                        {errors.eventDateTime.message}
                    </Text>
                )}

                <Text style={styles.label}>Lieu</Text>
                <Controller
                    control={control}
                    name="location"
                    rules={{
                        required: 'Le lieu est requis',
                        minLength: {
                            value: 2,
                            message: 'Au moins 2 caractères',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.location && (
                    <Text style={styles.error}>{errors.location.message}</Text>
                )}

                <Text style={styles.label}>Image URL</Text>
                <Controller
                    control={control}
                    name="imageUrl"
                    rules={{
                        required: 'L’URL est requise',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.imageUrl && (
                    <Text style={styles.error}>{errors.imageUrl.message}</Text>
                )}

                <View style={styles.switchRow}>
                    <Text style={styles.label}>À la une</Text>
                    <Controller
                        control={control}
                        name="featured"
                        render={({ field: { onChange, value } }) => (
                            <Switch onValueChange={onChange} value={value} />
                        )}
                    />
                </View>

                <MainButton
                    label="Enregistrer"
                    onPress={handleSubmit(onSubmit)}
                    fullWidth
                />
                <MainButton
                    label="Annuler"
                    onPress={() => setEditMode(false)}
                    size="small"
                    style={styles.cancelButton}
                />
            </ScrollContainer>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: theme.colors.primary,
    },
    info: { marginBottom: 20 },
    label: { fontSize: 16, marginTop: 12, color: theme.colors.primary },
    value: { fontSize: 16, marginTop: 4, color: theme.colors.secondaryText },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 16,
    },
    actionButton: {
        marginRight: theme.spacing.lg,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 4,
        padding: 8,
        marginTop: 4,
        backgroundColor: theme.colors.secondaryText,
        color: theme.colors.buttonText,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    error: { color: theme.colors.danger, marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cancelButton: {
        marginTop: 12,
        backgroundColor: theme.colors.secondaryText,
    },
});
