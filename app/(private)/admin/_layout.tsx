import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { theme } from '@/styles/theme';
import WebWrapper from '@/app/components/utils/WebWrapper';
import ScrollContainer from '@/app/components/ui/ScrollContainer';

export default function AdminLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);
    const roles = useAuthStore((s) => s.roles);

    // Redirect to login if not ADMIN
    useEffect(() => {
        if (!user || !roles.includes('ADMIN')) {
            router.replace({
                pathname: '/login',
                params: { redirectTo: pathname },
            });
        }
    }, [user, roles, pathname, router]);

    return (
        <View style={styles.container}>
            {/* Global header  <HeaderWeb /> */}

            {/* Admin navigation menu 
            <View style={styles.navContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.navScroll}
                >
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => router.push('/admin/offers')}
                    >
                        <Text style={styles.navText}>Offres</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => router.push('/admin/events')}
                    >
                        <Text style={styles.navText}>Événements</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>*/}

            {/* Content area with wrappers */}
            <WebWrapper>
                <ScrollContainer
                    contentContainerStyle={styles.contentContainer}
                >
                    <Slot />
                </ScrollContainer>
            </WebWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    navContainer: {
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
    },
    navScroll: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    navButton: {
        marginRight: theme.spacing.lg,
    },
    navText: {
        fontSize: 16,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    contentContainer: {
        // MODIF: style pour ScrollContainer
        padding: theme.spacing.md,
        backgroundColor: theme.colors.page,
    },
});
