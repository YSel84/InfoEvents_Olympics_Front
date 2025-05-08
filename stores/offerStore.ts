import { create } from 'zustand';
import {
    fetchOffersByEvent,
    Offer as ApiOffer,
} from '../app/lib/_eventService';

export interface Offer {
    offerId: string;
    name: string;
    price: number;
    stock: number;
}

type OfferStore = {
    offers: Offer[];
    quantities: Record<string, number>;

    fetchOffers: (eventId: string) => Promise<void>;
    increment: (offerId: string) => void;
    decrement: (offerId: string) => void;
    resetQuantities: () => void;
};

export const useOfferStore = create<OfferStore>((set, get) => ({
    offers: [],
    quantities: {},

    fetchOffers: async (eventId: string) => {
        const apiOffers: ApiOffer[] = await fetchOffersByEvent(eventId);
        set({
            offers: apiOffers,
            quantities: apiOffers.reduce(
                (acc, o) => ({ ...acc, [o.offerId]: 0 }),
                {} as Record<string, number>,
            ),
        });
    },

    increment: (offerId: string) =>
        set((state) => ({
            quantities: {
                ...state.quantities,
                [offerId]: (state.quantities[offerId] || 0) + 1,
            },
        })),

    decrement: (offerId: string) =>
        set((state) => ({
            quantities: {
                ...state.quantities,
                [offerId]: Math.max((state.quantities[offerId] || 0) - 1, 0),
            },
        })),

    resetQuantities: () =>
        set((state) => ({
            quantities: state.offers.reduce(
                (acc, o) => {
                    acc[o.offerId] = 0;
                    return acc;
                },
                {} as Record<string, number>,
            ),
        })),
}));
