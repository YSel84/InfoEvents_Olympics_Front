import { fetchWithAuth } from '../_api';
import { Offer } from '../../../app/types';

/** Fetch all offers (admin) */
export async function fetchAllOffers(): Promise<Offer[]> {
    const res = await fetchWithAuth(`/admin/offers`, { method: 'GET' });
    if (!res.ok) throw new Error(`fetchAllOffers: ${res.status}`);
    const raw = (await res.json()) as any[];

    return raw.map((o) => ({
        offerId: o.offerId,
        // si l’API renvoie eventId directement, on l’utilise ;
        // sinon on prend o.event.id (cas où l’API renvoie l’objet event)
        eventId: o.eventId ?? o.event?.id,
        name: o.name,
        price: o.price,
        stock: o.stock,
    }));
}

/** Create a new offer */
export async function createOffer(payload: {
    eventId: number;
    name: string;
    price: number;
    stock: number;
}): Promise<Offer> {
    const res = await fetchWithAuth(`/admin/offers`, {
        method: 'POST',
        body: JSON.stringify({
            event: { id: payload.eventId }, // <-- champ `event` avec l’ID
            name: payload.name,
            price: payload.price,
            stock: payload.stock,
        }),
    });
    if (!res.ok) throw new Error(`createOffer: ${res.status}`);
    return (await res.json()) as Offer;
}

/** Update an existing offer */
export async function updateOffer(
    offerId: number,
    payload: {
        eventId: number;
        name: string;
        price: number;
        stock: number;
    },
): Promise<Offer> {
    const res = await fetchWithAuth(`/admin/offers/${offerId}`, {
        method: 'PUT',
        body: JSON.stringify({
            event: { id: payload.eventId },
            name: payload.name,
            price: payload.price,
            stock: payload.stock,
        }),
    });
    if (!res.ok) throw new Error(`updateOffer: ${res.status}`);
    return (await res.json()) as Offer;
}

/** Delete an offer */
export async function deleteOffer(offerId: number): Promise<void> {
    const res = await fetchWithAuth(`/admin/offers/${offerId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(`deleteOffer: ${res.status}`);
}

/** Fetch number of tickets sold for an offer */
export async function fetchOfferSales(offerId: number): Promise<number> {
    const res = await fetchWithAuth(`/admin/offers/${offerId}/sales`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error(`fetchOfferSales: ${res.status}`);
    const count = await res.json();
    return typeof count === 'number' ? count : parseInt(count, 10);
}
