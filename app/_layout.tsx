import { Slot } from 'expo-router';
import { Platform, View } from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import TabBar from './components/TabBar';

export default function RootLayout() {
    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === 'web' && <Header />}
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
            {Platform.OS === 'web' ? <Footer /> : <TabBar />}
        </View>
    );
}
