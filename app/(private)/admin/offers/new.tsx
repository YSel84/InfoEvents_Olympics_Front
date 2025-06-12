import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import WebWrapper from '../../../components/utils/WebWrapper';
import ScrollContainer from '../../../components/ui/ScrollContainer';
import MainButton from '@/app/components/ui/MainButton';
import { fetchEvents } from '@/app/lib/_eventService';
import { createOffer } from '../../../lib/admin/_offerService';
import { theme } from '@/styles/theme';

type FormValues = {
    eventId: number | '';
    name: string;
    price: string; // string pour TextInput, parsé en nombre
    stock: string; // string pour TextInput, parsé en nombre
};

export default function NewOfferScreen() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            eventId: '',
            name: '',
            price: '',
            stock: '',
        },
    });

    const [events, setEvents] = useState<{ id: number; title: string }[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const evts = await fetchEvents();
                // map vers { id, title }
                setEvents(evts.map((e) => ({ id: e.id, title: e.title })));
            } catch {
                Alert.alert(
                    'Erreur',
                    'Impossible de charger la liste des événements',
                );
            } finally {
                setLoadingEvents(false);
            }
        })();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            await createOffer({
                eventId: Number(data.eventId),
                name: data.name.trim(),
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
            });
            router.replace('/admin/offers');
        } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Création échouée');
        }
    };

    if (loadingEvents) {
        return (
            <WebWrapper>
                <ScrollContainer contentContainerStyle={styles.center}>
                    <ActivityIndicator size="large" />
                </ScrollContainer>
            </WebWrapper>
        );
    }

    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Nouvelle Offre</Text>

                {/* Sélecteur d’événement */}
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
                            onValueChange={(val) => onChange(val)}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="-- Choisissez un événement --"
                                value=""
                            />
                            {events.map((ev) => (
                                <Picker.Item
                                    key={ev.id}
                                    label={ev.title}
                                    value={ev.id}
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
                            placeholder="Par exemple : Billet VIP"
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
                            placeholder="Ex : 49.90"
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
                                'Le stock doit être >= 0'
                            );
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Ex : 100"
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.stock && (
                    <Text style={styles.error}>{errors.stock.message}</Text>
                )}

                {/* Bouton Soumettre */}
                <MainButton
                    label="Créer l’offre"
                    onPress={handleSubmit(onSubmit)}
                    style={{ marginTop: theme.spacing.md, width: 200 }}
                />
                <MainButton
                    label="Annuler"
                    onPress={() => router.back()}
                    style={{
                        backgroundColor: theme.colors.secondaryText,
                        marginTop: theme.spacing.md,
                        width: 200,
                    }}
                />
            </ScrollContainer>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: theme.colors.primary,
    },
    label: {
        fontSize: 16,
        marginTop: 12,
        color: theme.colors.primary,
    },
    picker: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 4,
        backgroundColor: theme.colors.secondaryText,
        color: theme.colors.buttonText,
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
    error: {
        color: theme.colors.danger,
        marginTop: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
