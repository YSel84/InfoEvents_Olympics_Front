import { View, Text, StyleSheet } from 'react-native';

export default function EventScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Les événements</Text>
            <Text style={styles.text}>
                Découvrez les événéments disponibles
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});
