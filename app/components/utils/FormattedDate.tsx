/**
 * Helper in order to not get a too verbose date managing when fetching events/offers
 *
 */

import React from 'react';
import { Text } from 'react-native';
import { format, parseISO, isValid } from 'date-fns';

interface Props {
    value: string | Date;
}
export const FormattedDate: React.FC<Props> = ({ value }) => {
    //debug log
    console.log('FormattedDate received: ', value);
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
    //logging de date
    console.log('Parsed Date object: ', date, 'isValid: ', isValid(date));

    //check validity
    if (!isValid(date)) {
        return <Text style={{ color: '#666' }}>Date indisponible</Text>;
    }
    const formatted = format(date, 'dd/MM/yyyy HH:mm');
    console.log('Formatted date String: ', formatted);
    return <Text>{formatted}</Text>;
};

//placeholder in case of error
