import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TextInput,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import WebWrapper from '../../../components/utils/WebWrapper';
import ScrollContainer from '../../../components/ui/ScrollContainer';
import MainButton from '@/app/components/ui/MainButton';
import { Offer } from '../../../types';
import * as offerService from '../../../lib/admin/_offerService';
import * as eventService from '@/app/lib/_eventService';
import { theme } from '@/styles/theme';

type FormValues = {
    eventId: string;
    name: string;
    price: string;
    stock: string;
};

export default function OfferDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const offerId = Number(id);

    const [loading, setLoading] = useState(true);
    const [offer, setOffer] = useState<Offer | null>(null);
    const [eventsMap, setEventsMap] = useState<Record<number, string>>({});
    const [events, setEvents] = useState<{ id: number; title: string }[]>([]);
    const [showSales, setShowSales] = useState(false);
    const [salesCount, setSalesCount] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    // React Hook Form pour le mode édition
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            eventId: '',
            name: '',
            price: '',
            stock: '',
        },
    });

    // Charger l’offre et la liste des événements
    useEffect(() => {
        (async () => {
            try {
                const [offres, evts] = await Promise.all([
                    offerService.fetchAllOffers(),
                    eventService.fetchEvents(),
                ]);

                // Trouver l’offre
                const existing =
                    offres.find((o) => o.offerId === offerId) || null;
                if (!existing) {
                    Alert.alert('Erreur', 'Offre introuvable');
                    router.replace('/admin/offers');
                    return;
                }
                setOffer(existing);

                // Construire le map eventId → title
                const map: Record<number, string> = {};
                evts.forEach((e) => (map[e.id] = e.title));
                setEventsMap(map);
                setEvents(evts.map((e) => ({ id: e.id, title: e.title })));

                // Initialiser le form si on passe en mode édition
                reset({
                    eventId: existing.eventId.toString(),
                    name: existing.name,
                    price: existing.price.toString(),
                    stock: existing.stock.toString(),
                });
            } catch (err: any) {
                Alert.alert(
                    'Erreur',
                    err.message || 'Impossible de charger les données',
                );
                router.replace('/admin/offers');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // Supprimer l’offre
    const doDelete = async () => {
        try {
            await offerService.deleteOffer(offerId);
            router.replace('/admin/offers');
        } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Suppression échouée');
        }
    };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Voulez-vous vraiment supprimer cette offre?')) {
                doDelete();
            }
        } else {
            Alert.alert(
                'Confirmation',
                'Voulez-vous vraiment supprimer cette offre ?',
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Supprimer',
                        style: 'destructive',
                        onPress: () => doDelete(),
                    },
                ],
            );
        }
    };

    // Charger le nombre de ventes
    const handleShowSales = async () => {
        if (salesCount === null) {
            try {
                const count = await offerService.fetchOfferSales(offerId);
                setSalesCount(count);
            } catch (err: any) {
                Alert.alert(
                    'Erreur',
                    err.message || 'Impossible de charger les ventes',
                );
                return;
            }
        }
        setShowSales((prev) => !prev);
    };

    // Gérer la soumission du formulaire d’édition
    const onSubmit = async (data: FormValues) => {
        try {
            await offerService.updateOffer(offerId, {
                eventId: Number(data.eventId),
                name: data.name.trim(),
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
            });
            // Après mise à jour, recharger l’offre
            setLoading(true);
            const refreshed = (await offerService.fetchAllOffers()).find(
                (o) => o.offerId === offerId,
            )!;
            setOffer(refreshed);
            // Réinitialiser le form avec les nouvelles valeurs
            reset({
                eventId: refreshed.eventId.toString(),
                name: refreshed.name,
                price: refreshed.price.toString(),
                stock: refreshed.stock.toString(),
            });
            setEditMode(false);
        } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Mise à jour échouée');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !offer) {
        return (
            <WebWrapper>
                <ScrollContainer contentContainerStyle={styles.center}>
                    <ActivityIndicator size="large" />
                </ScrollContainer>
            </WebWrapper>
        );
    }

    // Affichage “détails” si pas en mode édition
    if (!editMode) {
        const eventTitle = eventsMap[offer.eventId] || '—';
        return (
            <WebWrapper>
                <ScrollContainer contentContainerStyle={styles.container}>
                    <Text style={styles.heading}>Détails de l’offre</Text>

                    <View style={styles.info}>
                        <Text style={styles.label}>Événement :</Text>
                        <Text style={styles.value}>{eventTitle}</Text>

                        <Text style={styles.label}>Nom :</Text>
                        <Text style={styles.value}>{offer.name}</Text>

                        <Text style={styles.label}>Prix :</Text>
                        <Text style={styles.value}>
                            {offer.price.toFixed(2)} €
                        </Text>

                        <Text style={styles.label}>Stock :</Text>
                        <Text style={styles.value}>{offer.stock}</Text>
                    </View>

                    <View style={styles.actionsRow}>
                        <MainButton
                            label="Modifier"
                            onPress={() => setEditMode(true)}
                            size="small"
                            style={styles.actionButton}
                        />
                        <MainButton
                            label={showSales ? 'Cacher ventes' : 'Voir ventes'}
                            onPress={handleShowSales}
                            size="small"
                            style={styles.actionButton}
                        />
                        <MainButton
                            label="Retour"
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

                    {showSales && (
                        <View style={styles.salesSection}>
                            <Text style={styles.salesText}>
                                {salesCount !== null
                                    ? `${salesCount} offre${salesCount > 1 ? 's' : ''} vendus`
                                    : 'Chargement des ventes...'}
                            </Text>
                        </View>
                    )}
                </ScrollContainer>
            </WebWrapper>
        );
    }

    // Mode Édition : formulaire prérempli
    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Modifier l’offre</Text>

                {/* Picker d’événement */}
                <Text style={styles.label}>Événement</Text>
                <Controller
                    control={control}
                    name="eventId"
                    rules={{
                        required: 'Veuillez sélectionner un événement',
                        validate: (v) =>
                            v !== '' || 'Veuillez sélectionner un événement',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Picker
                            selectedValue={value}
                            onValueChange={(val) => onChange(val as string)}
                            style={styles.picker}
                        >
                            {events.map((ev) => (
                                <Picker.Item
                                    key={ev.id}
                                    label={ev.title}
                                    value={ev.id.toString()}
                                />
                            ))}
                        </Picker>
                    )}
                />
                {errors.eventId && (
                    <Text style={styles.error}>{errors.eventId.message}</Text>
                )}

                {/* Champ Nom */}
                <Text style={styles.label}>Nom de l’offre</Text>
                <Controller
                    control={control}
                    name="name"
                    rules={{
                        required: 'Le nom est requis',
                        minLength: {
                            value: 2,
                            message:
                                'Le nom doit contenir au moins 2 caractères',
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
                {errors.name && (
                    <Text style={styles.error}>{errors.name.message}</Text>
                )}

                {/* Champ Prix */}
                <Text style={styles.label}>Prix (€)</Text>
                <Controller
                    control={control}
                    name="price"
                    rules={{
                        required: 'Le prix est requis',
                        validate: (v) => {
                            const num = parseFloat(v.replace(',', '.'));
                            return num > 0 || 'Le prix doit être supérieur à 0';
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.price && (
                    <Text style={styles.error}>{errors.price.message}</Text>
                )}

                {/* Champ Stock */}
                <Text style={styles.label}>Stock</Text>
                <Controller
                    control={control}
                    name="stock"
                    rules={{
                        required: 'Le stock est requis',
                        validate: (v) => {
                            const num = parseInt(v, 10);
                            return (
                                (!isNaN(num) && num >= 0) ||
                                'Le stock doit être ≥ 0'
                            );
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.stock && (
                    <Text style={styles.error}>{errors.stock.message}</Text>
                )}

                <MainButton
                    label="Enregistrer"
                    onPress={handleSubmit(onSubmit)}
                    style={{ marginTop: theme.spacing.md }}
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
    container: { padding: 16, alignItems: 'center' },
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
        marginRight: theme.spacing.md,
    },
    actionButton: {
        marginRight: theme.spacing.lg,
    },
    salesSection: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
    },
    salesText: { fontSize: 16, fontWeight: '500' },
    picker: {
        backgroundColor: theme.colors.secondaryText,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 4,
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
    error: { color: theme.colors.danger, marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cancelButton: {
        marginTop: 12,
        backgroundColor: theme.colors.secondaryText,
    }, // or any color for cancel
});
