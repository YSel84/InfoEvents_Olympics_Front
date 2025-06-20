/**
 * Helper/wrapper for cross-platform date-picker
 *
 */

import React, { useState } from 'react';
import {
    Platform,
    TouchableOpacity,
    TextInput,
    Text,
    StyleSheet,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { theme } from '../../../styles/theme';

interface Props {
    value: string;
    onChange: (newVal: string) => void;
    placeholder?: string;
    includeTime?: boolean;
}

export function DatePickerField({
    value,
    onChange,
    placeholder = 'Sélectionner une date',
    includeTime = false,
}: Props) {
    const [isVisible, setVisible] = useState(false);

    const handleConfirm = (d: Date) => {
        setVisible(false);
        const fmt = includeTime
            ? format(d, "yyyy-MM-dd'T'HH:mm", { locale: fr })
            : format(d, 'yyyy-MM-dd', { locale: fr });
        onChange(fmt);
    };

    // **Web:** on utilise un input native type="date" au focus
    if (Platform.OS === 'web') {
        return (
            <TextInput
                placeholder={placeholder}
                style={styles.webInput}
                value={value}
                placeholderTextColor={theme.colors.buttonText}
                onFocus={(e: any) => {
                    e.target.type = includeTime ? 'datetime-local' : 'date';
                }}
                onChangeText={onChange}
            />
        );
    }

    // **Mobile:** bouton ouvrant un modal « joli »
    return (
        <TouchableOpacity
            style={styles.mobileField}
            onPress={() => setVisible(true)}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, !value && styles.placeholder]}>
                {value
                    ? includeTime
                        ? format(new Date(value), 'dd MMM yyyy HH:mm', {
                              locale: fr,
                          })
                        : format(new Date(value), 'dd MMM yyyy', { locale: fr })
                    : placeholder}
            </Text>
            <DateTimePickerModal
                isVisible={isVisible}
                mode={includeTime ? 'datetime' : 'date'}
                maximumDate={new Date()}
                onConfirm={handleConfirm}
                onCancel={() => setVisible(false)}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    webInput: {
        borderWidth: 1,
        borderColor: theme.colors.page,
        backgroundColor: theme.colors.secondaryText,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        color: theme.colors.buttonText,
    },
    mobileField: {
        borderWidth: 1,
        borderColor: theme.colors.secondaryText,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    text: {
        color: theme.colors.text,
    },
    placeholder: {
        color: theme.colors.text,
    },
});
