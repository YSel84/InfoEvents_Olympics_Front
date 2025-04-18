import { create } from 'zustand';
import { OfferType, OFFER_DEFINITIONS } from './offerStore';

export type CartItem = {
    id: string;
    eventId: string;
    eventTitle: string;
    offerType: OfferType;
    quantity: number;
};

type CartStore = {
    cartItems: CartItem[];
    addToCart: (item: {
        eventId: string;
        eventTitle: string;
        offerType: OfferType;
        quantity: number;
    }) => void;
    updateCart: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    resetCart: () => void;
    getTotalQuantity: () => number;
    getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
    cartItems: [],

    addToCart: ({ eventId, eventTitle, offerType, quantity }) => {
        const id = `${eventId}_${offerType}`;
        const existing = get().cartItems.find((item) => item.id === id);

        if (existing) {
            // Mise à jour de la quantité si déjà présent
            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                ),
            }));
        } else {
            // Ajout d’un nouvel item
            const newItem: CartItem = {
                id,
                eventId,
                eventTitle,
                offerType,
                quantity,
            };
            set((state) => ({
                cartItems: [...state.cartItems, newItem],
            }));
        }
    },

    updateCart: (itemId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(itemId);
        } else {
            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item,
                ),
            }));
        }
    },

    removeItem: (itemId) => {
        set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== itemId),
        }));
    },

    resetCart: () => {
        set({ cartItems: [] });
    },

    getTotalQuantity: () =>
        get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

    getTotalPrice: () =>
        get().cartItems.reduce((sum, item) => {
            const price = OFFER_DEFINITIONS[item.offerType].price;
            return sum + price * item.quantity;
        }, 0),
}));
