import {
    TouchableOpacity,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { theme } from '../../styles/theme';

type Props = {
    label: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>; //TypeScript was unhappy, so StyleProp...
};

export default function MainButton({ label, onPress, style }: Props) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.buttonBackground,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
    },
    text: {
        color: theme.colors.buttonText,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
