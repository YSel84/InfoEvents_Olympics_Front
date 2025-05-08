/**
 * get the events list
 * use fetchWithAUth for auto JWT usage
 *
 */
import { fetchWithAuth } from './_api';

export type Event = {
    id: string;
    title: string;
    location: string;
    description: string;
    event_datetime: string;
    image_url: string;
    featured: boolean;
};

/*export type RawOffer = {
    offer_id: string;
    event_id: string;
    name: string;
    price: number;
    stock: number;
};*/

export type Offer = {
    offerId: string;
    eventId: string;
    name: string;
    price: number;
    stock: number;
};

//full list
export async function fetchEvents(): Promise<Event[]> {
    const res = await fetchWithAuth('/events', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Erreur au chargement des événements');
    }
    const raw = (await res.json()) as any[];

    return raw.map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        description: e.description,
        event_datetime: e.eventDateTime ?? e.event_datetime ?? '',
        image_url: e.imageUrl ?? e.image_url ?? '',
        featured: e.featured,
    }));
}

//Event by id for details
export async function fetchEventById(id: string): Promise<Event> {
    const res = await fetchWithAuth(`/events/${id}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Evénement introuvable');
    }
    const e = (await res.json()) as any;

    return {
        id: e.id,
        title: e.title,
        location: e.location,
        description: e.description,
        event_datetime: e.eventDateTime ?? e.event_datetime ?? '',
        image_url: e.imageUrl ?? e.image_url ?? '',
        featured: e.featured,
    };
}

//offers by events
export async function fetchOffersByEvent(eventId: string): Promise<Offer[]> {
    const res = await fetchWithAuth(`/events/${eventId}/offers`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Erreur au chargement des offres');

    const raw = (await res.json()) as any[];

    return raw.map((o) => ({
        offerId: String(o.offerId),
        eventId: String(o.eventId),
        name: o.name,
        price: o.price,
        stock: o.stock ?? 0,
    }));
}
