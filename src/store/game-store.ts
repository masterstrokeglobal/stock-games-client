import Lobby from '@/models/lobby'
import LobbyRound from '@/models/lobby-round'
import { create } from 'zustand'

interface LoadingState {
    isLobbyLoading: boolean
    isRoundLoading: boolean
}

interface GameState {
    // Data
    lobby: Lobby | null
    lobbyRound: LobbyRound | null

    // Loading states
    loading: LoadingState

    // Setters
    setLobby: (lobby: Lobby | null) => void
    setLobbyRound: (round: LobbyRound | null) => void

    // Loading setters
    setLobbyLoading: (isLoading: boolean) => void
    setRoundLoading: (isLoading: boolean) => void

    // Utility actions
    updateAll: (lobby: Lobby | null, round: LobbyRound | null) => void
    clearAll: () => void
}

export const useGameStore = create<GameState>((set) => ({
    // Initial data state
    lobby: null,
    lobbyRound: null,

    // Initial loading state
    loading: {
        isLobbyLoading: false,
        isRoundLoading: false
    },

    // Data setters
    setLobby: (lobby) => set({ lobby }),
    setLobbyRound: (round) => set({ lobbyRound: round }),

    // Loading setters
    setLobbyLoading: (isLoading) => set((state) => ({
        loading: { ...state.loading, isLobbyLoading: isLoading }
    })),

    setRoundLoading: (isLoading) => set((state) => ({
        loading: { ...state.loading, isRoundLoading: isLoading }
    })),

    // Utility actions
    updateAll: (lobby, round) => set({
        lobby,
        lobbyRound: round
    }),

    clearAll: () => set({
        lobby: null,
        lobbyRound: null,
        loading: {
            isLobbyLoading: false,
            isRoundLoading: false
        }
    })
}))

// Selector hook for convenience
export const useIsGameLoading = () => {
    const loading = useGameStore((state) => state.loading)
    return loading.isLobbyLoading || loading.isRoundLoading
}