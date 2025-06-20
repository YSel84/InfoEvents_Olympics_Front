import { fetchWithAuth } from '../_api';
import { Event } from '../../../app/types';

export async function fetchAllEvents(): Promise<Event[]> {
    const res = await fetchWithAuth(`/admin/events`, { method: 'GET' });
    if (!res.ok) throw new Error(`fetchAllEvents: ${res.status}`);
    const raw = (await res.json()) as any[];

    return raw.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        eventDateTime: e.eventDateTime ?? e.event_datetime,
        featured: e.featured,
        imageUrl: e.imageUrl,
        location: e.location,
    }));
}

export async function createEvent(payload: {
    title: string;
    description: string;
    location: string;
    eventDateTime: string;
    imageUrl: string;
    featured: boolean;
}): Promise<Event> {
    const res = await fetchWithAuth(`/admin/events`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`createEvent: ${res.status}`);
    const e = (await res.json()) as any;
    return {
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        eventDateTime: e.eventDateTime ?? e.event_datetime,
        imageUrl: e.imageUrl,
        featured: e.featured,
    };
}

export async function updateEvent(
    eventId: number,
    payload: {
        title: string;
        description: string;
        location: string;
        eventDateTime: string;
        imageUrl: string;
        featured: boolean;
    },
): Promise<Event> {
    const res = await fetchWithAuth(`/admin/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`updateEvent: ${res.status}`);
    const e = (await res.json()) as any;
    return {
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        eventDateTime: e.eventDateTime ?? e.event_datetime,
        imageUrl: e.imageUrl,
        featured: e.featured,
    };
}

export async function deleteEvent(eventId: number): Promise<void> {
    const res = await fetchWithAuth(`/admin/events/${eventId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(`deleteEvent: ${res.status}`);
}
