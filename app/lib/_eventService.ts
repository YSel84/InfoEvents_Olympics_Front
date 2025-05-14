import { fetchWithAuth } from './_api';
import { Event, Offer } from '../types';

/**
 * All events
 */
export async function fetchEvents(): Promise<Event[]> {
    const res = await fetchWithAuth(`/events`, { method: 'GET' });
    if (!res.ok) throw new Error(`fetchEvents: ${res.status}`);
    const raw = (await res.json()) as any[];
    return raw.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        eventDateTime: e.eventDateTime ?? e.event_datetime, //just in case
        imageUrl: e.imageUrl,
        featured: e.featured ?? false,
    }));
}

/**
 * event details
 */
export async function fetchEventById(id: string): Promise<Event> {
    const res = await fetchWithAuth(`/events/${id}`, { method: 'GET' });
    if (!res.ok) throw new Error(`fetchEventById: ${res.status}`);
    const e = (await res.json()) as any;
    return {
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        eventDateTime: e.eventDateTime ?? e.event_datetime, //just in case
        imageUrl: e.imageUrl,
        featured: e.featured ?? false,
    };
}

/**
 * offers by event
 */
export async function fetchOffersByEvent(eventId: string): Promise<Offer[]> {
    const res = await fetchWithAuth(`/events/${eventId}/offers`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error(`fetchOffersByEvent: ${res.status}`);
    const raw = (await res.json()) as any[];
    return raw.map((o) => ({
        offerId: o.offerId,
        eventId: o.eventId,
        name: o.name,
        price: o.price,
        stock: o.stock ?? 0,
    }));
}

export { Event, Offer };
