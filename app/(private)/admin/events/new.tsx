import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Switch,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import WebWrapper from '../../../components/utils/WebWrapper';
import ScrollContainer from '../../../components/ui/ScrollContainer';
import MainButton from '../../../components/ui/MainButton';
import { DatePickerField } from '@/app/components/ui/DatePicker';
import * as eventService from '../../../lib/admin/_eventService';
import { theme } from '@/styles/theme';

// Définition des champs du formulaire
type FormValues = {
    title: string;
    description: string;
    location: string;
    eventDateTime: string;
    imageUrl: string;
    featured: boolean;
};

export default function NewEventScreen() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            description: '',
            location: '',
            eventDateTime: '',
            imageUrl: '',
            featured: false,
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await eventService.createEvent({
                title: data.title.trim(),
                description: data.description.trim(),
                location: data.location.trim(),
                eventDateTime: data.eventDateTime,
                imageUrl: data.imageUrl.trim(),
                featured: data.featured,
            });
            router.replace('/admin/events');
        } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Création échouée');
        }
    };

    return (
        <WebWrapper>
            <ScrollContainer contentContainerStyle={styles.container}>
                <View style={{ alignSelf: 'center', width: 800 }}>
                    <Text style={styles.heading}>Nouvel événement</Text>

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

                    <Text style={styles.label}>Date de l'événement</Text>
                    <Controller
                        control={control}
                        name="eventDateTime"
                        rules={{
                            required: 'La date/heure est requise',
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <DatePickerField
                                value={value}
                                onChange={onChange}
                                placeholder="Sélectionner la date"
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
                        <Text style={styles.error}>
                            {errors.location.message}
                        </Text>
                    )}

                    <Text style={styles.label}>Image URL</Text>
                    <Controller
                        control={control}
                        name="imageUrl"
                        rules={{ required: 'L’URL est requise' }}
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
                        <Text style={styles.error}>
                            {errors.imageUrl.message}
                        </Text>
                    )}

                    <View style={styles.switchRow}>
                        <Text style={styles.label}>À la une</Text>
                        <Controller
                            control={control}
                            name="featured"
                            render={({ field: { onChange, value } }) => (
                                <Switch
                                    onValueChange={onChange}
                                    value={value}
                                />
                            )}
                        />
                    </View>
                </View>

                {isSubmitting ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <MainButton
                        label="Créer l’événement"
                        onPress={handleSubmit(onSubmit)}
                        style={{
                            marginTop: theme.spacing.md,
                            width: 200,
                            alignSelf: 'center',
                        }}
                    />
                )}

                <MainButton
                    label="Annuler"
                    onPress={() => router.replace('/admin/events')}
                    style={[
                        styles.cancelButton,
                        { width: 200, alignSelf: 'center' },
                    ]}
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
    label: {
        fontSize: 16,
        marginTop: 12,
        marginRight: theme.spacing.sm,
        color: theme.colors.primary,
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
        justifyContent: 'flex-start',
        marginTop: 12,
        marginBottom: theme.spacing.md,
    },
    error: { color: theme.colors.danger, marginTop: 4 },
    cancelButton: {
        marginTop: 12,
        backgroundColor: theme.colors.secondaryText,
    },
});
