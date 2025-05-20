import { useCartStore } from '@/stores/cartStore';
import { fetchWithAuth } from './_api';

const CART_BASE = '/cart';
const ITEMS_BASE = '/cart/items';

export type CartItemDto = {
    id: number; // identifiant unique de la ligne de panier
    offerId: number; // identifiant de l’offre
    quantity: number; // quantité choisie
    eventId: number; // identifiant de l’événement
    eventTitle: string; // titre de l’événement
};

export type CartDetails = {
    cartId: number;
    items: CartItemDto[];
};

export type ValidateCartResponse = {
    ok: boolean;
    total: number;
    errors: string[];
};

/**
 * Create or fetch cart (guest or connected)
 * sessionId of sessions
 *returns cart id *
 */
export async function createOrGetCart(sessionId: string): Promise<number> {
    const res = await fetchWithAuth(`${CART_BASE}`, {
        method: 'POST',
        headers: { 'X-Session-Id': sessionId },
    });
    if (!res.ok) {
        throw new Error(`createOrGetCart: ${res.status}`);
    }
    const { cartId } = await res.json();
    return cartId;
}

/**
 * Fetch existing cart details
 * returns details or null if no cart
 */
export async function getCartDetails(
    sessionId: string,
): Promise<CartDetails | null> {
    const res = await fetchWithAuth(CART_BASE, {
        method: 'GET',
        headers: { 'X-Session-Id': sessionId },
    });
    if (res.status === 204 || res.status === 404) return null;
    if (!res.ok) throw new Error(`getCartDetails: ${res.status}`);
    const json = await res.json();
    // selon votre payload, vous pourriez avoir json.cartDetails ou json
    const body = (json.cartDetails ?? json) as CartDetails;
    return body;
}

/**
 * Merge cart guest-> connected user
 * retuns new merged cart Id
 *
 */
export async function mergeCart(sessionId: string): Promise<number> {
    const res = await fetchWithAuth(`${CART_BASE}/merge`, {
        method: 'PUT',
        headers: { 'X-Session-Id': sessionId },
        body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) throw new Error(`mergeCart: ${res.status}`);
    const { cartId } = await res.json();
    return cartId;
}

/**
 * Validate cart, fetch total, erros
 *
 */
export async function validateCart(
    cardId: number,
): Promise<ValidateCartResponse> {
    const res = await fetchWithAuth(`${CART_BASE}/validate`, {
        method: 'POST',
        headers: { 'X-Session-Id': useCartStore.getState().sessionId },
        body: JSON.stringify({ cardId }),
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error('UNAUTHORIZED');

        throw new Error(`validateCart: ${res.status}`);
    }
    return await res.json();
}

/**
 * add item, increment
 *  */
export async function addCartItem(
    sessionId: string,
    offerId: number,
    quantity: number,
): Promise<CartDetails> {
    //console.log('[addCartItem]args ->', { sessionId, offerId, quantity });
    const res = await fetchWithAuth(ITEMS_BASE, {
        method: 'POST',
        headers: { 'X-Session-Id': sessionId },
        body: JSON.stringify({ offerId, quantity }),
    });
    if (!res.ok) {
        throw new Error(`addCartItem: ${res.status} `);
    }
    return await res.json();
}

/**
 * Refresh quantities of existing item
 * R
 */
export async function updateCartItem(
    sessionId: string,
    itemId: number,
    quantity: number,
): Promise<CartDetails> {
    const res = await fetchWithAuth(`${ITEMS_BASE}/${itemId}`, {
        method: 'PATCH',
        headers: { 'X-Session-Id': sessionId },
        body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error(`updateCartItem: ${res.status}`);

    return await res.json();
}

/**
 * Delete item from cart
 */
export async function deleteCartItem(
    sessionId: string,
    itemId: number,
    quantity?: number,
): Promise<CartDetails> {
    const res = await fetchWithAuth(`${ITEMS_BASE}/${itemId}`, {
        method: 'DELETE',
        headers: { 'X-Session-Id': sessionId },
    });
    if (!res.ok) throw new Error(`deleteCartItem: ${res.status}`);

    return await res.json();
}
