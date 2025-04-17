import { Platform } from 'react-native';

export type Event = {
    id: string;
    title: string;
    location: string;
    description: string;
    date: string;
    image_url: string;
    featured: boolean;
};

const API_BASE_URL =
    Platform.OS === 'web'
        ? 'http://localhost:8080'
        : 'http://192.168.1.123:8080'; // API sprint boot local

export async function fetchEvents(): Promise<Event[]> {
    const res = await fetch(`${API_BASE_URL}/api/events`);

    if (!res.ok) {
        throw new Error('Erreur lors du chargement des événements');
    }

    return res.json();
}
export async function fetchEventById(id: string): Promise<Event> {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`);

    if (!res.ok) {
        throw new Error('Evénement introuvable');
    }
    return res.json();
}
