import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { baseText } from '../../styles/common';
import { theme } from '../../styles/theme';
import MainButton from './ui/MainButton';

type Props = {
    quantity: number;
    onChange: (newQty: number) => void;
};

export default function QuantityControls({ quantity, onChange }: Props) {
    return (
        <View style={styles.container}>
            <MainButton
                label="-"
                onPress={() => onChange(quantity - 1)}
                size="small"
                style={styles.btn}
            />
            <Text style={styles.text}>{quantity}</Text>
            <MainButton
                label="+"
                onPress={() => onChange(quantity + 1)}
                size="small"
                style={styles.btn}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        marginHorizontal: theme.spacing.xs,
        fontWeight: 'bold',
        fontSize: 12,
    },
    text: {
        ...baseText,
        width: 24,
        textAlign: 'center',
    },
});
