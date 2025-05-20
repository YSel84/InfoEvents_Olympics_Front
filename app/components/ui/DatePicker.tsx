/**
 * Helper/wrapper for cross-platform date-picker
 *
 *
 */

import {
    Platform,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { theme } from '../../../styles/theme';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
    date: string;
    onChange: (isoDate: string) => void;
    placeholder?: string;
};

export function DatePickerField({
    date,
    onChange,
    placeholder = 'Date de naissance',
}: Props) {
    const [show, setShow] = useState(false);
    //format for UI
    const formatted = date ? new Date(date).toLocaleDateString('fr-FR') : '';

    //Web input HTML date "classic"
    if (Platform.OS === 'web') {
        return (
            <ReactDatePicker
                selected={date ? new Date(date) : null}
                onChange={(d: Date | null) => {
                    if (d) {
                        onChange(d.toISOString().split('T')[0]);
                    }
                }}
                placeholderText={placeholder}
                maxDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className=""
            />
        );
    } else {
        //iOS & Android : react native
        return (
            <View style={styles.mobileContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShow(true)}
                >
                    <Text
                        style={[styles.buttonText, !date && styles.placeholder]}
                    >
                        {date ? formatted : placeholder}
                    </Text>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        mode="date"
                        display="calendar"
                        value={date ? new Date(date) : new Date()}
                        maximumDate={new Date()}
                        onChange={(
                            _e: DateTimePickerEvent,
                            selected?: Date,
                        ) => {
                            setShow(false);
                            if (selected) {
                                onChange(selected.toISOString().split('T')[0]);
                            }
                        }}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mobileContainer: {
        marginBottom: theme.spacing.sm,
    },
    button: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.secondaryText,
        borderRadius: theme.borderRadius,
        backgroundColor: theme.colors.surface,
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    placeholder: {
        color: theme.colors.secondaryText,
    },
});
