import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import WebWrapper from './components/WebWrapper';

export default function LoginPage() {
    return (
        <WebWrapper>
            <View style={styles.container}>
                <Text> LoginPage</Text>
            </View>
        </WebWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
