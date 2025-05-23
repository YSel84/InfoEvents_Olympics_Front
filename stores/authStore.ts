import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {
    login as apiLogin,
    fetchMe,
    UserProfile,
    RegisterRequest,
    register as apiRegister,
} from '../app/lib/_authService';
import { useCartStore } from './cartStore';

interface AuthState {
    accessToken: string | null;
    user: UserProfile | null;
    roles: string[];
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<void>;
    fetchProfile: () => Promise<void>;
    logout: () => void;
}

/**
 * Décode le payload (deuxième segment) d’un JWT
 */
function parseJwt<T>(token: string): T {
    const [, payload] = token.split('.');
    // On replace URL-safe chars, puis on pad avec '=' si nécessaire
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = 4 - (b64.length % 4);
    const b64Padded = b64 + '='.repeat(pad === 4 ? 0 : pad);
    const json = atob(b64Padded);
    return JSON.parse(json) as T;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            roles: [],
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    // 1) Authentification et token
                    const token = await apiLogin(email, password);
                    set({ accessToken: token });

                    // 2) Décodage du JWT pour extraire les rôles
                    const decoded = parseJwt<{ roles: string[] }>(token);
                    set({ roles: decoded.roles });

                    // 3) Chargement du profil complet
                    const profile = await fetchMe(token);
                    set({ user: profile, isLoading: false });

                    // 4) Fusion du panier invité
                    await useCartStore.getState().mergeCart();
                } catch (err: any) {
                    set({
                        error: err.message ?? 'Erreur de connexion',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            register: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    await apiRegister(payload);
                    //login après register
                    await get().login(payload.email, payload.password);
                } catch (err: any) {
                    set({
                        error: err.message ?? "Erreur d'inscription",
                        isLoading: false,
                    });
                    throw err;
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const token = get().accessToken;
                    if (!token) throw new Error('Token manquant');
                    const profile = await fetchMe(token);
                    set({
                        user: profile,
                        roles: [profile.role],
                        isLoading: false,
                    });
                } catch (err: any) {
                    set({
                        error:
                            err.message ?? 'Erreur de récupération du profil',
                        isLoading: false,
                    });
                }
            },

            logout: () => {
                set({ accessToken: null, user: null, roles: [] });
            },
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() =>
                Platform.OS === 'web'
                    ? {
                          getItem: (k) =>
                              Promise.resolve(localStorage.getItem(k)),
                          setItem: (k, v) => (
                              localStorage.setItem(k, v), Promise.resolve()
                          ),
                          removeItem: (k) => (
                              localStorage.removeItem(k), Promise.resolve()
                          ),
                      }
                    : {
                          getItem: (k) => SecureStore.getItemAsync(k),
                          setItem: (k, v) => SecureStore.setItemAsync(k, v),
                          removeItem: (k) => SecureStore.deleteItemAsync(k),
                      },
            ),
            partialize: (state) => ({
                accessToken: state.accessToken,
                user: state.user,
                roles: state.roles,
            }),
        },
    ),
);
