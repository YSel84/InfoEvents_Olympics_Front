import {
    View,
    StyleSheet,
    Platform,
    useWindowDimensions,
    DimensionValue,
} from 'react-native';
import { theme } from '../../styles/theme';

export default function WebWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { width } = useWindowDimensions();

    if (Platform.OS !== 'web') return <>{children}</>;

    let maxWidth: DimensionValue = '100%';
    if (width >= theme.layout.breakpoints.xl)
        maxWidth = theme.layout.maxWidth.xl!;
    else if (width >= theme.layout.breakpoints.lg)
        maxWidth = theme.layout.maxWidth.lg!;
    else if (width >= theme.layout.breakpoints.md)
        maxWidth = theme.layout.maxWidth.md!;
    else if (width >= theme.layout.breakpoints.sm) maxWidth = '90%';

    return (
        <View style={styles.outer}>
            <View style={[styles.inner, { maxWidth }]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,
        alignItems: 'center',
    },
    inner: {
        width: '100%',
        flex: 1,
        backgroundColor: theme.colors.page,
    },
});
