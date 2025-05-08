import { useWindowDimensions } from 'react-native';
import { theme } from '../../styles/theme';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
export function useBreakpoint(): Breakpoint {
    const { width } = useWindowDimensions();
    if (width >= theme.layout.breakpoints.xl) return 'xl';
    if (width >= theme.layout.breakpoints.lg) return 'lg';
    if (width >= theme.layout.breakpoints.md) return 'md';
    return 'sm';
}
