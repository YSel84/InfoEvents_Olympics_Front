/**
 * Helper in order to not get a too verbose date managing when fetching events/offers
 *
 */

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { theme } from '@/styles/theme';

interface Props {
    value: string | Date;
    style?: TextStyle;
}
export const FormattedDate: React.FC<Props> = ({ value }) => {
    //convert into date
    let date: Date;
    if (typeof value === 'string') {
        try {
            date = parseISO(value);
        } catch {
            date = new Date(value);
        }
    } else {
        date = value;
    }

    //check validity
    if (!isValid(date)) {
        return <Text style={{ color: '#666' }}>Date indisponible</Text>;
    }
    const formatted = format(date, 'd MMMM yyyy HH:mm', { locale: fr });

    return <Text style={styles.dateText}>{formatted}</Text>;
};

const styles = StyleSheet.create({
    dateText: {
        color: theme.colors.text,
        fontSize: 16,
    },
});
