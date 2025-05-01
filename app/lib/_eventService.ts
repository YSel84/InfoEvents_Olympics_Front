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
    date: string;
    image_url: string;
    featured: boolean;
};

//full list
export async function fetchEvents(): Promise<Event[]> {
    const res = await fetchWithAuth('/events', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Erreur au chargement des événements');
    }
    return res.json();
}

//Event by id for details
export async function fetchEventById(id: string): Promise<Event> {
    const res = await fetchWithAuth(`/events/${id}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Evénement introuvable');
    }
    return res.json();
}
