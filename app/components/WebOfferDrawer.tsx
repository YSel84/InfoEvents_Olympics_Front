import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';

import { theme } from '../../styles/theme';
import MainButton from './MainButton';

import { useOfferStore } from '@/stores/offerStore';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onValidate: () => void;
};

const offers = ['Solo', 'Duo', 'Familiale'] as const;

export default function WebOfferDrawer({ isOpen, onClose, onValidate }: Props) {
    const { quantities, increment, decrement } = useOfferStore();

    if (Platform.OS !== 'web' || !isOpen) return null;

    return (
        <View style={styles.drawer}>
            <Text style={styles.title}>Choisissez vos billets</Text>

            {offers.map((offer) => (
                <View key={offer} style={styles.offerRow}>
                    <Text style={styles.offerName}>{offer}</Text>
                    <View style={styles.controls}>
                        <TouchableOpacity
                            onPress={() => decrement(offer)}
                            style={styles.controlButton}
                        >
                            <Text style={styles.controlText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantities[offer]}</Text>
                        <TouchableOpacity
                            onPress={() => increment(offer)}
                            style={styles.controlButton}
                        >
                            {' '}
                            <Text style={styles.controlText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <View style={styles.actions}>
                <MainButton label="Valider" onPress={onValidate} />
                <MainButton label="Fermer" onPress={onClose} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: 'fixed',
        right: 0,
        top: 0,
        width: 600,
        height: '100%',
        backgroundColor: theme.colors.page,
        padding: theme.spacing.lg,
        borderLeftWidth: 11,
        borderLeftColor: theme.colors.border,
        zIndex: 999,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
        textAlign: 'center',
    },
    offerRow: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    offerName: {
        fontSize: 16,
        color: theme.colors.text,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 'theme.spacing.sm',
    },
    controlButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    controlText: {
        color: theme.colors.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantity: {
        fontSize: 16,
        color: theme.colors.text,
        marginHorizontal: 8,
    },
    actions: {
        marginTop: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
});
