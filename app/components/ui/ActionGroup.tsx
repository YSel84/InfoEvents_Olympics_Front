import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';
import MainButton, { ButtonSize } from './MainButton';

type Action = {
    label: string;
    onPress: () => void;
    size?: ButtonSize;
    danger?: boolean;
};

type Props = {
    actions: Action[];
};

export default function ActionGroup({ actions }: Props) {
    return (
        <View style={styles.container}>
            {actions.map(
                ({ label, onPress, size = 'medium', danger = false }) => (
                    <MainButton
                        key={label}
                        label={label}
                        onPress={onPress}
                        size={size}
                        fullWidth
                        danger={danger}
                        style={styles.button}
                    />
                ),
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: theme.spacing.lg,
    },
    button: {
        maxWidth: theme.layout.maxWidth.md * 0.6,
        marginBottom: theme.spacing.lg,
    } as ViewStyle,
});
