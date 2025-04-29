import api from "./instance";
import { StockSlotPlacementType } from "../../models/stock-slot-placement";
export const gameRecordAPI = {
  createGameRecord: async (data: any) => {
    return api.post("/game-records", data);
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
  getStockSlotGameRecord: async (roundId: string) => {
    return api.get(`/stock-slot-placement/current-round-placements/${roundId}`);
  },
  getMyStockSlotGameRecord: async (roundId: string) => {
    return api.get(`/stock-slot-placement/my-current-placement/${roundId}`);
  },
  createStockSlotGameRecord: async (data: { roundId: string, marketItem: number, placement: StockSlotPlacementType, amount: number }) => {
    return api.post(`/stock-slot-placement`, data);
  }
};