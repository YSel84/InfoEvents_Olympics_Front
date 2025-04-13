import { View, Text, StyleSheet } from 'react-native';

export default function LoremIpsum() {
    return (
        <View style={styles.container}>
            <Text> LoginPage</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
