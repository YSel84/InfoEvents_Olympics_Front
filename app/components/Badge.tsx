import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ value }: { value: number }) {
    if (value <= 0) return null;

    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        zIndex: 1,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
