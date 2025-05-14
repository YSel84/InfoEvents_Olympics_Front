/**
 * Wrapper, will get token from authStore
 * add as header authorization for each request
 * deal with 401
 *
 */

import Constants from 'expo-constants';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL ?? 'http://localhost:8080';

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
