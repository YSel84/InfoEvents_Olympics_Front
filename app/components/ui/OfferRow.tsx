import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';
import MainButton from './MainButton';

export interface OfferRowProps {
    name: string;
    price: number;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

const OfferRow: React.FC<OfferRowProps> = ({
    name,
    price,
    quantity,
    onIncrement,
    onDecrement,
}) => {
    // Calcul de la description en fonction du type d'offre
    const ticketCountMap: Record<string, number> = {
        Solo: 1,
        Duo: 2,
        Familiale: 4,
    };
    const ticketCount = ticketCountMap[name] || 0;
    const description = `${ticketCount} billet${ticketCount > 1 ? 's' : ''}`;

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.price}>{price} €</Text>
            </View>
            <View style={styles.controlsWrapper}>
                <Text style={styles.quantityLabel}>Quantité</Text>
                <View style={styles.buttonGroup}>
                    <MainButton label="−" size="small" onPress={onDecrement} />
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <MainButton label="+" size="small" onPress={onIncrement} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
    },
    info: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 16,
        color: theme.colors.primary,
    },
    description: {
        fontSize: 14,
        color: theme.colors.secondaryText,
    },
    price: {
        fontSize: 14,
        color: theme.colors.text,
        marginTop: theme.spacing.xs,
    },
    controlsWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    quantityLabel: {
        fontSize: 12,
        color: theme.colors.secondaryText,
        marginBottom: theme.spacing.xs,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    quantityValue: {
        fontSize: 16,
        color: theme.colors.text,
        marginHorizontal: theme.spacing.sm,
    },
});

export default OfferRow;
