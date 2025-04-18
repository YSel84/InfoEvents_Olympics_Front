import { View, Text, StyleSheet } from 'react-native';

export default function AccountScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue, X,Y,Z</Text>
            <Text style={styles.text}>Lorem ipsum sit dolor</Text>
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
