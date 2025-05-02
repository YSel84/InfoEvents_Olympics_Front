import { create } from 'zustand';

export type OfferType = 'Solo' | 'Duo' | 'Familiale';

export type OfferDetails = {
    label: string;
    price: number;
};

export const OFFER_DEFINITIONS: Record<OfferType, OfferDetails> = {
    Solo: { label: 'Solo - Un billet', price: 100 },
    Duo: { label: 'Duo - Deux billets', price: 190 },
    Familiale: { label: 'Familiale - Quatre billets', price: 340 },
};

type OfferStore = {
    quantities: Record<OfferType, number>;
    increment: (type: OfferType) => void;
    decrement: (type: OfferType) => void;
    reset: () => void;
};

export const useOfferStore = create<OfferStore>((set) => ({
    quantities: {
        Solo: 0,
        Duo: 0,
        Familiale: 0,
    },
    increment: (type) =>
        set((state) => ({
            quantities: {
                ...state.quantities,
                [type]: state.quantities[type] + 1,
            },
        })),
    decrement: (type) =>
        set((state) => ({
            quantities: {
                ...state.quantities,
                [type]: Math.max(state.quantities[type] - 1, 0),
            },
        })),
    reset: () =>
        set({
            quantities: {
                Solo: 0,
                Duo: 0,
                Familiale: 0,
            },
        }),
}));
