import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default function Footer() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>©InfoEvent - 2024</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
    },
    text: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
