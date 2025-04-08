import { create } from 'zustand';
import MarketItem from '@/models/market-item';

interface StockBettingState {
    selectedStock: MarketItem | null;
    betAmount: number;
    isLoading: boolean;

    // Actions
    setSelectedStock: (stock: MarketItem | null) => void;
    setBetAmount: (amount: number) => void;
    setIsLoading: (loading: boolean) => void;
}

export const useStockBettingStore = create<StockBettingState>((set) => ({
    selectedStock: null,
    betAmount: 100,
    isLoading: false,

    setSelectedStock: (stock) => set({ selectedStock: stock }),
    setBetAmount: (amount) => set({ betAmount: amount }),
    setIsLoading: (loading) => set({ isLoading: loading }),
}));