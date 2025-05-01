/**
 * "private" pages, logged in only
 *
 */
import { Slot } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';

export default function PrivateLayout() {
    const router = useRouter();
    const token = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        }
    }, [token, router]);
    return <Slot />;
}
