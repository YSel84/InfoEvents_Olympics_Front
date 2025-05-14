/**
 * Wrapper, will get token from authStore
 * add as header authorization for each request
 * deal with 401
 *
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

// Base URL pour web vs mobile, avec fallback local
const extra = Constants.expoConfig?.extra as Record<string, string>;

export const API_BASE_URL =
    Platform.OS === 'web'
        ? (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api')
        : extra.API_BASE_URL!;

export const FRONT_USERNAME =
    Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_FRONT_USERNAME!
        : extra.FRONT_USERNAME!;

export const FRONT_PASSWORD =
    Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_FRONT_PASSWORD!
        : extra.FRONT_PASSWORD!;

/**const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL ?? 'http://localhost:8080'; */

export async function fetchWithAuth(
    path: string,
    options: RequestInit = {},
): Promise<Response> {
    const { accessToken, logout } = useAuthStore.getState();
    //full url
    const url = `${API_BASE_URL}${path}`;

    //default headers
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Session-Id': '',
    };
    //fetch sessionId in options or store
    const sessionHeader =
        (options.headers as Record<string, string>)?.['X-Session-ID'] ||
        useCartStore.getState().sessionId;
    defaultHeaders['X-Session-Id'] = sessionHeader;

    //merge headers
    const headers = {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    //Stringify body
    let body = options.body;
    if (body && typeof body !== 'string') {
        body = JSON.stringify(body);
    }

    const finalOptions: RequestInit = {
        ...options,
        headers,
        body,
    };

    //debug
    //console.log('[fetchWIthAuth] ->', url, finalOptions);

    const res = await fetch(url, finalOptions);
    if (res.status === 401) {
        logout();
    }
    return res;
}
