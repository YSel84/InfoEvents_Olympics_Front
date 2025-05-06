import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//Components
import MainButton from './ui/MainButton';
import Modal from 'react-native-modal';

//Data, theme & store
import { useOfferStore } from '@/stores/offerStore';
import { theme } from '../../styles/theme';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onValidate: () => void;
};

const offers = ['Solo', 'Duo', 'Familiale'] as const;

export default function TicketOfferModal({
    isVisible,
    onClose,
    onValidate,
}: Props) {
    /*const [quantities, setQuantities] = useState<{ [key: string]: number }>({
        Solo: 0,
        Duo: 0,
        Familiale: 0,
    });*/
    const { quantities, increment, decrement } = useOfferStore();

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Offres disponibles</Text>
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
                            <Text style={styles.quantity}>
                                {quantities[offer]}
                            </Text>
                            <TouchableOpacity
                                onPress={() => increment(offer)}
                                style={styles.controlButton}
                            >
                                <Text style={styles.controlText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.actions}>
                    <MainButton
                        label="Valider votre choix"
                        onPress={onValidate}
                    />
                    <MainButton label="Fermer" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: theme.colors.page,
        padding: theme.spacing.lg,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
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
        gap: theme.spacing.sm,
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
