import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import * as cartService from '@/app/lib/_cartService';
import { useAuthStore } from './authStore';

export type CartItem = {
    id: string;
    eventId: number;
    eventTitle: string;
    offerId: number;
    quantity: number;
};

interface CartStore {
    sessionId: string;
    cartId: number | null;
    cartItems: CartItem[];
    total: number;
    errors: string[];

    initCart: () => Promise<void>;
    refreshCartDetails: () => Promise<void>;
    validateCart: () => Promise<void>;
    addToCart: (offerId: number, quantity: number) => Promise<void>;
    updateCart: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    mergeCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
    sessionId: '',
    cartId: null,
    cartItems: [],
    total: 0,
    errors: [],

    initCart: async () => {
        // 1) récupérer ou générer le sessionId
        let sid = await AsyncStorage.getItem('sessionId');
        if (!sid) {
            sid = uuidv4();
            await AsyncStorage.setItem('sessionId', sid);
        }
        set({ sessionId: sid });

        // 2) créer ou récupérer le panier backend
        try {
            const cartId = await cartService.createOrGetCart(sid);
            set({ cartId });
        } catch (e) {
            const details = await cartService.getCartDetails(sid);
            if (details) set({ cartId: details.cartId });
        }

        // 3) charger les lignes
        await get().refreshCartDetails();
    },

    refreshCartDetails: async () => {
        const sid = get().sessionId;
        if (!sid) return;

        const details = await cartService.getCartDetails(sid);
        if (details) {
            const items = details.items.map((i) => ({
                id: i.id.toString(),
                eventId: i.eventId,
                eventTitle: i.eventTitle,
                offerId: i.offerId,
                quantity: i.quantity,
            }));
            const total = items.reduce((sum, it) => sum + it.quantity, 0);
            set({ cartItems: items, total });
        } else {
            set({ cartItems: [], total: 0 });
        }
    },

    validateCart: async () => {
        const cartId = get().cartId;
        if (!cartId) throw new Error('No cartId');
        try {
            const { ok, total, errors } =
                await cartService.validateCart(cartId);
            set({ total, errors });
        } catch (e: any) {
            if (e.message === 'UNAUTHORIZED') throw new Error('UNAUTHORIZED');
            console.error(e);
        }
    },

    addToCart: async (offerId, quantity) => {
        const sid = get().sessionId;
        if (!sid) throw new Error('No session id');

        await cartService.addCartItem(sid, offerId, quantity);
        await get().refreshCartDetails();
    },

    updateCart: async (itemId, quantity) => {
        const sid = get().sessionId;
        if (!sid) throw new Error('No session id');
        await cartService.updateCartItem(sid, Number(itemId), quantity);
        await get().refreshCartDetails();
    },

    removeItem: async (itemId) => {
        const sid = get().sessionId;
        if (!sid) throw new Error('No session id');
        await cartService.deleteCartItem(sid, Number(itemId));
        await get().refreshCartDetails();
    },

    mergeCart: async () => {
        const sid = get().sessionId;
        if (!sid) return;

        try {
            const newId = await cartService.mergeCart(sid);
            set({ cartId: newId });
            await get().refreshCartDetails();
        } catch (e) {
            console.error('[cartStore] mergeCart failed', e);
        }
    },
}));
