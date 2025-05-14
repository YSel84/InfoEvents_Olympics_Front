/**
 * Shared styles
 *
 */

import { theme } from './theme';
import { ViewStyle, TextStyle } from 'react-native';

//Main text
export const baseText: TextStyle = {
    color: theme.colors.text,
    fontSize: 16,
};

//Responsive grid
export const gridContainer: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -theme.spacing.sm,
};

//grid item
export const gridItem: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    maxWidth: '100%',
};
