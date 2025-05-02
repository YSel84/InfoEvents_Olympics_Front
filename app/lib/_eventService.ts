import { encode as btoa } from 'base-64';
import Constants from 'expo-constants';
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

const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;

//EXPO_PUBLIC for communication with backend WEB version
//Mobile : expo.extra

const API_BASE_URL =
    Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_API_BASE_URL!
        : extra.EXPO_PUBLIC_API_BASE_URL!;

const FRONT_USERNAME =
    Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_FRONT_USERNAME!
        : extra.FRONT_USERNAME!;

const FRONT_PASSWORD =
    Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_FRONT_PASSWORD
        : extra.FRONT_PASSWORD;

const basicAuthHeader = 'Basic ' + btoa(`${FRONT_USERNAME}:${FRONT_PASSWORD}`);

export async function fetchEvents(): Promise<Event[]> {
    if (!API_BASE_URL) {
        throw new Error("'API_BASE_URL non défini- vérifier .env et config");
    }
    const res = await fetch(`${API_BASE_URL}/events`, {
        headers: {
            Authorization: basicAuthHeader,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Erreur lors du chargement des événements');
    }

    return res.json();
}
export async function fetchEventById(id: string): Promise<Event> {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        headers: { Authorization: basicAuthHeader },
    });

    if (!res.ok) {
        throw new Error('Evénement introuvable');
    }
    return res.json();
}
