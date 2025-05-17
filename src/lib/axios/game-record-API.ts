import api from "./instance";
import { StockSlotPlacementType } from "../../models/stock-slot-placement";
import { StockSlotJackpotPlacementType } from "../../models/stock-slot-jackpot";

export const gameRecordAPI = {
  createGameRecord: async (data: any) => {
    return api.post("/game-records", data);
  },

  createPlacementBet: async (data: any) => {
    return api.post("/lobby/create-placement", data);
  },

  createMiniMutualFundPlacementBet: async (data: any) => {
    return api.post("/lobby/mini-mutual-fund/create-placement", data);
  },
  getCurrentPlacementForLobbyRound: async (id: string) => {
    return api.get(`/lobby/user-placement/${id}`);
  },
  getAllPlacementForLobbyRound: async (id: string) => {
    return api.get(`/lobby/current-placement/${id}`);
  },

  getWinningGameRecord: async () => {
    return api.get("/game-records/winning");
  },

  getTopPlacements: async (roundId: string) => {
    return api.get("/game-records/top-placements", {
      params: { roundId }
    });
  },

  getMyPlacements: async (filter: any) => {
    return api.get("/game-records/my-placements", {
      params: filter
    });
  },
  getGameRecordHistory: async (filter: any) => {
    return api.get("/round-records/history", {
      params: filter
    });
  },
  undoLastPlacement: async (roundId: string) => {
    return api.post(`/game-records/undo/${roundId}`);
  },
  // single game betting placement 
  createSinglePlayerRouletteBet: async (data: any) => {
    return api.post("/singleplayer-game-placements", data);
  } 
  ,

  getMyCurrentPlacement: async (roundId: string) => {
    return api.get(`/singleplayer-game-placements/my-current-placement/${roundId}`);
  },
  getCurrentRoundPlacements: async (roundId: string) => {
    return api.get(`/singleplayer-game-placements/current-round-placements/${roundId}`);
  }
  ,
  repeatPlacement: async (roundId: string) => {
    return api.post(`/game-records/repeat/${roundId}`);
  }
  ,
  clearPlacement: async (roundId: string) => {
    return api.post(`/game-records/clear/${roundId}`);
  },
  // stock slot 
  getStockSlotGameRecord: async (roundId: number) => {
    return api.get(`/stock-slot-placement/current-round-placements/${roundId}`);
  },
  getMyStockSlotGameRecord: async (roundId: number) => {
    return api.get(`/stock-slot-placement/my-current-placement/${roundId}`);
  },
  createStockSlotGameRecord: async (data: { roundId: string, marketItem: number, placement: StockSlotPlacementType, amount: number }) => {
    return api.post(`/stock-slot-placement`, data);
  },
  getStockSlotRoundResult: async (roundId: string) => {
    return api.get(`/stock-slot-placement/result/${roundId}`);
  },
  // slot jackpot
  getSlotJackpotGameRecord: async (roundId: number) => {
    return api.get(`/stock-jackpot-placement/current-round-placements/${roundId}`);
  },
  getMySlotJackpotGameRecord: async (roundId: number) => {
    return api.get(`/stock-jackpot-placement/my-current-placement/${roundId}`);
  },
  createStockJackpotGameRecord: async (data: { roundId: number, marketItem: number, placement: StockSlotJackpotPlacementType, amount: number, placedNumber: number }) => {
    return api.post(`/stock-jackpot-placement`, data);
  },
  getStockJackpotRoundResult: async (roundId: number) => {
    return api.get(`/stock-jackpot-placement/result/${roundId}`);
  }
};