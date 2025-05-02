/**
 * Shared styles
 *
 */

import { theme } from './theme';
import { ViewStyle, TextStyle } from 'react-native';

//Standard Card
export const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
};

//Centered container
export const centeredContainer: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
};

//Main text
export const baseText: TextStyle = {
    color: theme.colors.text,
    fontSize: 16,
};
