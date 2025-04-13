import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderMobile() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#111" barStyle="light-content" />
            <View style={styles.container}>
                <Text style={styles.logo}>Logo</Text>
                <Text style={styles.title}>InfoEvent Olympics</Text>
                <View style={styles.icons}>
                    <TouchableOpacity>
                        <Ionicons
                            name="person-outline"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons
                            name="cart-outline"
                            size={22}
                            color="#fff"
                            style={{ marginLeft: 16 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#111',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: 22,
        color: '#fff',
    },
    title: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    safeArea: {
        backgroundColor: '#111',
    },
});
