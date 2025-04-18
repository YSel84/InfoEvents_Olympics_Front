import { create } from 'zustand';

type EventStore = {
    visibleCount: number;
    increaseVisibleCount: (step?: number) => void;
    reset: () => void;
};

export const useEventStore = create<EventStore>((set) => ({
    visibleCount: 6,
    increaseVisibleCount: (step = 6) =>
        set((state) => ({ visibleCount: state.visibleCount + step })),
    reset: () => set({ visibleCount: 6 }),
}));
