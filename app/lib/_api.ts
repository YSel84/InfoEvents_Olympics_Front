/**
 * Wrapper, will get token from authStore
 * add as header authorization for each request
 * deal with 401
 *
 */

import Constants from 'expo-constants';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL ?? 'http://localhost:8080';

export async function fetchWithAuth(
    path: string,
    options: RequestInit = {},
): Promise<Response> {
    const { accessToken, logout } = useAuthStore.getState();

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
    });

    if (res.status === 401) {
        //invalid or expired token
        logout();
    }
    return res;
}
