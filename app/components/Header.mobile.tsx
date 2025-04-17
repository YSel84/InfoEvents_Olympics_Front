import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
//theme & stores
import { theme } from '../../styles/theme';
import { useCartStore } from '@/stores/cartStore';

import Badge from './Badge';

export default function HeaderMobile() {
    //expo router thingy
    const router = useRouter();
    //Used for cart
    const total = useCartStore((state) => state.getTotalQuantity());

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
                    <TouchableOpacity onPress={() => router.push('/cart')}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="cart-outline"
                                size={24}
                                color={theme.colors.primary}
                                style={{ marginLeft: 16 }}
                            />
                            <Badge value={total} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
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
        gap: theme.spacing.md,
    },
    safeArea: {
        backgroundColor: theme.colors.background,
    },
    iconContainer: {
        position: 'relative',
        padding: 4,
    },
});
