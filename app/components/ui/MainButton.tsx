import React from 'react';

import {
    TouchableOpacity,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { theme } from '../../../styles/theme';

export type ButtonSize = 'small' | 'medium' | 'large';

type Props = {
    label: string;
    onPress: () => void;
    size?: ButtonSize;
    fullWidth?: boolean;
    danger?: boolean;
    style?: StyleProp<ViewStyle>; //TypeScript was unhappy, so StyleProp...
};

export default function MainButton({
    label,
    onPress,
    size = 'medium',
    fullWidth = false,
    danger = false,
    style,
}: Props) {
    //colors
    const backgroundColor = danger
        ? theme.colors.danger
        : theme.colors.buttonBackground;
    const textColor = theme.colors.buttonText;
    //size
    const sizeStyles: ViewStyle = {
        paddingVertical:
            size === 'small'
                ? theme.spacing.sm
                : size === 'large'
                  ? theme.spacing.lg
                  : theme.spacing.md,
        paddingHorizontal:
            size === 'small'
                ? theme.spacing.sm
                : size === 'large'
                  ? theme.spacing.xl
                  : theme.spacing.lg,
        minWidth: size === 'small' ? 30 : size === 'large' ? 200 : 120,
    };
    //full width
    const fullWidthStyles: ViewStyle = fullWidth
        ? {
              alignSelf: 'center',
              width: '100%',
              maxWidth: theme.layout.maxWidth.md * 0.8,
          }
        : {};

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.button,
                { backgroundColor },
                sizeStyles,
                fullWidthStyles,
                style,
            ]}
        >
            <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});
