import { create } from "zustand";

interface BettingHistoryState {
    bettingHistory: any[]
    setBettingHistory: (bettingHistory: any[]) => void
    clearBettingHistory: () => void
    addBettingHistory: (bettingHistory: any) => void
}

export const useBettingHistoryStore = create<BettingHistoryState>((set) => ({
    bettingHistory: [],
    setBettingHistory: (bettingHistory: any[]) => set({ bettingHistory }),
    clearBettingHistory: () => set({ bettingHistory: [] }),
    addBettingHistory: (bettingHistory: any) => set((state) => ({ bettingHistory: [...state.bettingHistory, bettingHistory] })),
}))