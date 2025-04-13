import { Slot } from 'expo-router';
import { Platform, View } from 'react-native';
import HeaderWeb from './components/Header';
import Footer from './components/Footer';
import TabBar from './components/TabBar';
import HeaderMobile from './components/Header.mobile';

export default function RootLayout() {
    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === 'web' ? <HeaderWeb /> : <HeaderMobile />}
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
            {Platform.OS === 'web' ? <Footer /> : <TabBar />}
        </View>
    );
}
