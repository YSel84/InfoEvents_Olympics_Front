/** *
 * Auth store for JWT
 * Persistence via Secure Store
 * + hydratation : persist restores accessToken & user
 *
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {
    login as apiLogin,
    register as apiRegister,
    fetchMe,
    UserProfile,
    RegisterRequest,
} from '../app/lib/_authService';

interface AuthState {
    accessToken: string | null;
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    //login, stores token and load profile
    login: (email: string, password: string) => Promise<void>;
    // create account + auto-login
    register: (payload: RegisterRequest) => Promise<void>;
    // load profile from persisting token
    fetchProfile: () => Promise<void>;
    // self-explainatory : log out...
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            isLoading: false,
            error: null,

            //login & auth via API
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    //auth via API
                    const token = await apiLogin(email, password);
                    //stored token
                    set({ accessToken: token });
                    // get profile + store
                    const profile = await fetchMe(token);
                    set({ user: profile, isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.message ?? 'Erreur de connexion',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            //register via API then auto login
            register: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    await apiRegister(payload);
                    //log
                    await get().login(payload.email, payload.password);
                } catch (err: any) {
                    set({
                        error: err.message ?? "Erreur d'inscription",
                        isLoading: false,
                    });
                    throw err;
                }
            },

            // relaod if token
            fetchProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const token = get().accessToken;
                    if (!token) throw new Error('Token manquant');
                    //re-load profile
                    const profile = await fetchMe(token);
                    set({ user: profile, isLoading: false });
                } catch (err: any) {
                    set({
                        error:
                            err.message ?? 'Erreur de récupération du profil',
                        isLoading: false,
                    });
                }
            },

            //log out & clear
            logout: () => {
                set({ accessToken: null, user: null });
            },
        }),
        {
            name: 'auth', //storage key
            storage: createJSONStorage(() => {
                if (Platform.OS === 'web') {
                    //fallback to localStorage
                    return {
                        getItem: (key: string) =>
                            Promise.resolve(localStorage.getItem(key)),
                        setItem: (key: string, value: string) => {
                            localStorage.setItem(key, value);
                            return Promise.resolve();
                        },
                        removeItem: (key: string) => {
                            localStorage.removeItem(key);
                            return Promise.resolve();
                        },
                    };
                } else {
                    //mobile
                    return {
                        getItem: (key: string) => SecureStore.getItemAsync(key),
                        setItem: (key: string, value: string) =>
                            SecureStore.setItemAsync(key, value),
                        removeItem: (key: string) =>
                            SecureStore.deleteItemAsync(key),
                    };
                }
            }),
        },
    ),
);
