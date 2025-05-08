import { create } from 'zustand';
import { useOfferStore } from './offerStore';

export type CartItem = {
    id: string;
    eventId: string;
    eventTitle: string;
    offerId: string;
    quantity: number;
};

type CartStore = {
    cartItems: CartItem[];
    addToCart: (item: {
        eventId: string;
        eventTitle: string;
        offerId: string;
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

    addToCart: ({ eventId, eventTitle, offerId, quantity }) => {
        const id = `${eventId}_${offerId}`;
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
                offerId,
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

    getTotalPrice: () => {
        const { offers } = useOfferStore.getState();
        return get().cartItems.reduce((sum, item) => {
            const offer = offers.find((o) => o.offerId === item.offerId);
            const price = offer ? offer.price : 0;
            return sum + price * item.quantity;
        }, 0);
    },
}));
