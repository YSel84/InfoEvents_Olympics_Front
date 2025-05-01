import Constants from 'expo-constants';

//API base URL
const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL ?? 'http://localhost:8080';

export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface RegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    password: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
}

export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    role: string;
}

/**
 * POST api/auth/login
 * returns token JWT *
 */
export async function login(email: string, password: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password } as AuthRequest),
    });
    if (!res.ok) {
        throw new Error('Echec de la connexion');
    }
    const data: AuthResponse = await res.json();
    return data.token;
}

/**
 * POST /api/auth/register
 * returns new user id + email *
 */
export async function register(
    payload: RegisterRequest,
): Promise<RegisterResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Echec de l'inscription");
    }
    const data: RegisterResponse = await res.json();
    return data;
}

/**
 * GET /api/auth/me
 * param : token jwt
 * returns profil
 */
export async function fetchMe(token: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw Error('Impossible de récupérer le profil');
    }
    const profile: UserProfile = await res.json();
    return profile;
}
