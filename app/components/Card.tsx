import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

export default function Card({
    title,
    imageSource,
}: {
    title: string;
    imageSource: string;
}) {
    return (
        <View style={styles.card}>
            <Image
                source={imageSource}
                style={styles.cardImage}
                contentFit="cover"
            />
            <Text style={styles.cardTitle}>{title}</Text>
            <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Plus d'informations</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 350,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 4,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardButton: {
        backgroundColor: '#111',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    cardButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});
