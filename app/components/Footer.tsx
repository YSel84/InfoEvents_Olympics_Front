import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Texte du Footer</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#222',
        alignItems: 'center',
    },
    text: {
        color: '#ccc',
        fontSize: 14,
    },
});
