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

export type Offer = {
    offer_id: string;
    event_id: string;
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
    console.log('fetchEvents raw:', raw);
    const mapped: Event[] = raw.map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        description: e.description,
        event_datetime: e.eventDateTime ?? e.event_datetime ?? '',
        image_url: e.imageUrl ?? e.image_url ?? '',
        featured: e.featured,
    }));
    console.log('fetchEvents mapped:', mapped);
    return mapped;
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
    console.log('fetchEventById raw:', e);
    const mapped: Event = {
        id: e.id,
        title: e.title,
        location: e.location,
        description: e.description,
        event_datetime: e.eventDateTime ?? e.event_datetime ?? '',
        image_url: e.imageUrl ?? e.image_url ?? '',
        featured: e.featured,
    };
    console.log('fetchEventById mapped:', mapped);
    return mapped;
}

//offers by events
export async function fetchOffersByEvent(eventId: string): Promise<Offer[]> {
    const res = await fetchWithAuth(`/events/${eventId}/offers`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Erreur au chargement des offres');
    }
    const offers = (await res.json()) as Offer[];
    console.log(`fetchOffersByEvent(${eventId}) raw:`, offers);
    return offers;
}
