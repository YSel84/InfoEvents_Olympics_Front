import { fetchWithAuth } from './_api';
import { TicketDto } from '../types';

/**
 * Critères de tri pour les billets.
 */
export type TicketSort = 'date' | 'event';

/**
 * Récupère tous les e-billets de l'utilisateur authentifié,
 * avec un tri optionnel.
 *
 * @param sortOption  'date' pour trier chronologiquement par eventDateTime,
 *                    'event' pour trier alphabétiquement par eventTitle.
 */
export async function getMyTickets(
    sortOption?: TicketSort,
): Promise<TicketDto[]> {
    const res = await fetchWithAuth('/tickets', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(`getMyTickets failed: ${res.status}`);
    }
    const tickets: TicketDto[] = await res.json();

    // Tri côté client
    if (sortOption === 'date') {
        return tickets.sort(
            (a, b) =>
                new Date(a.eventDateTime).getTime() -
                new Date(b.eventDateTime).getTime(),
        );
    } else if (sortOption === 'event') {
        return tickets.sort((a, b) =>
            a.eventTitle.localeCompare(b.eventTitle, undefined, {
                sensitivity: 'base',
            }),
        );
    }

    return tickets;
}
