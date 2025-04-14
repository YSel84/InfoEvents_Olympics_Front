import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function HeaderMobile() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor={theme.colors.background}
                barStyle="light-content"
            />
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>InfoEvent Olympics</Text>

                <View style={styles.icons}>
                    <TouchableOpacity>
                        <Ionicons
                            name="person-outline"
                            size={22}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons
                            name="cart-outline"
                            size={22}
                            color={theme.colors.primary}
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
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: 36,
        height: 36,
    },
    title: {
        fontSize: 18,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    safeArea: {
        backgroundColor: theme.colors.background,
    },
});
