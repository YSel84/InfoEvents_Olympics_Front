import { Platform } from 'react-native';
import Constants from 'expo-constants';

export type Event = {
    id: string;
    title: string;
    location: string;
    description: string;
    date: string;
    image_url: string;
    featured: boolean;
};

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

console.log('API Base Url:', API_BASE_URL);

export async function fetchEvents(): Promise<Event[]> {
    const res = await fetch(`${API_BASE_URL}/events`);

    if (!res.ok) {
        throw new Error('Erreur lors du chargement des événements');
    }

    return res.json();
}
export async function fetchEventById(id: string): Promise<Event> {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);

    if (!res.ok) {
        throw new Error('Evénement introuvable');
    }
    return res.json();
}
