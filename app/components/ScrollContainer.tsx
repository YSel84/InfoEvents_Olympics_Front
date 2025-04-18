import { ScrollView, StyleSheet, } from 'react-native';
import { theme } from '../../styles/theme';

export default function ScrollContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.page,
    },
    content: {
        paddingBottom: 100,
    },
});
