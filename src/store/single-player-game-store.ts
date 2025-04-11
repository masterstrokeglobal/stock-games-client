import { RoundRecord } from '@/models/round-record'
import { create } from 'zustand'


interface GameState {
    // Data
    roundRecord: RoundRecord | null

    // Loading states
    loading: boolean

    // Setters
    setRoundRecord: (roundRecord: RoundRecord | null) => void

    // Loading setters
    setRoundLoading: (isLoading: boolean) => void

    // Utility actions
    clearAll: () => void
}

export const useSinglePlayerGameStore = create<GameState>((set) => ({
    // Initial data state
    roundRecord: null,

    // Initial loading state
    loading: false,

    // Data setters
    setRoundRecord: (roundRecord) => set({ roundRecord }),

    // Loading setters
    setRoundLoading: (isLoading) => set({ loading: isLoading }),

    // Utility actions
    clearAll: () => set({
        roundRecord: null,
        loading: false,
    })
}))

// Selector hook for convenience
export const useIsGameLoading = () => {
    const loading = useSinglePlayerGameStore((state) => state.loading)
    return loading
}