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
    if (width >= 1400) maxWidth = 1400;
    else if (width >= 1200) maxWidth = 1080;
    else if (width >= 992) maxWidth = 900;
    else if (width >= 768) maxWidth = '90%';

    return (
        <View style={styles.outerMargin}>
            <View
                style={[
                    styles.innerContent,
                    { maxWidth, minHeight: '100vh' as any },
                ]}
            >
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerMargin: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    innerContent: {
        width: '100%',
        maxWidth: 1200,
        backgroundColor: theme.colors.page,
    },
});
