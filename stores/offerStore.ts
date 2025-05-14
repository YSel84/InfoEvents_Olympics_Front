import { create } from 'zustand';
import * as eventService from '@/app/lib/_eventService';

export type Offer = {
    offerId: number;
    eventId: number;
    name: string;
    price: number;
    stock: number;
};

interface OfferStore {
    offers: Offer[];
    offersByEvent: Record<string, Offer[]>;
    quantities: Record<number, number>;

    fetchOffers: (eventId: string) => Promise<void>;
    resetQuantities: () => void;
    increment: (offerId: number) => void;
    decrement: (offerId: number) => void;
}

export const useOfferStore = create<OfferStore>((set, get) => ({
    offers: [],
    offersByEvent: {},
    quantities: {},

    fetchOffers: async (eventId: string) => {
        set({ offers: [] });

        const cache = get().offersByEvent[eventId];
        if (cache) {
            set({ offers: cache });
        } else {
            const data = await eventService.fetchOffersByEvent(eventId);
            set((state) => ({
                offersByEvent: {
                    ...state.offersByEvent,
                    [eventId]: data,
                },
                offers: data,
            }));
        }
    },

    resetQuantities: () => {
        set({ quantities: {} });
    },

    increment: (offerId: number) => {
        set((state) => ({
            quantities: {
                ...state.quantities,
                [offerId]: (state.quantities[offerId] ?? 0) + 1,
            },
        }));
    },

    decrement: (offerId: number) => {
        set((state) => {
            const current = state.quantities[offerId] ?? 0;
            if (current <= 0) {
                return {};
            }
            return {
                quantities: {
                    ...state.quantities,
                    [offerId]: current - 1,
                },
            };
        });
    },
}));
