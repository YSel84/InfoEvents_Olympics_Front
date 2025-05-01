import {
    ScrollView,
    StyleSheet,
    ScrollViewProps,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { theme } from '../../styles/theme';

interface Props extends ScrollViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function ScrollContainer({
    children,
    style,
    contentContainerStyle,
    ...rest
}: Props) {
    return (
        <ScrollView
            style={[styles.container, style]}
            contentContainerStyle={[styles.content, contentContainerStyle]}
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
        flexGrow: 1,
        backgroundColor: theme.colors.page,

    },
});
