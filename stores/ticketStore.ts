import { create } from 'zustand';
import { getMyTickets, TicketSort } from '../app/lib/_ticketService';
import { TicketDto } from '../app/types';

interface TicketStore {
    tickets: TicketDto[];
    loading: boolean;
    error: string | null;
    sortOption: TicketSort;

    /**
     * Charge les billets de l'utilisateur, optionnellement triés
     */
    fetchTickets: (sortOption?: TicketSort) => Promise<void>;
    /**
     * Change le critère de tri et réordonne le tableau existant
     */
    setSortOption: (sortOption: TicketSort) => void;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
    tickets: [], // Liste des tickets récupérés
    loading: false,
    error: null,
    sortOption: 'date', // critère de tri par défaut

    // Action pour récupérer les billets depuis l'API
    fetchTickets: async (sortOption) => {
        set({ loading: true, error: null });
        try {
            // Appel au service front, en passant le critère de tri
            const tickets = await getMyTickets(sortOption ?? get().sortOption);
            set({
                tickets,
                loading: false,
                sortOption: sortOption ?? get().sortOption,
            });
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    // Action pour modifier le critère de tri client-side
    setSortOption: (sortOption) => {
        // Réordonnancement en mémoire sans recharger du back
        const sorted = [...get().tickets].sort((a, b) => {
            if (sortOption === 'date') {
                return (
                    new Date(a.eventDateTime).getTime() -
                    new Date(b.eventDateTime).getTime()
                );
            }
            // 'event'
            return a.eventTitle.localeCompare(b.eventTitle, undefined, {
                sensitivity: 'base',
            });
        });

        set({ sortOption, tickets: sorted });
    },
}));
