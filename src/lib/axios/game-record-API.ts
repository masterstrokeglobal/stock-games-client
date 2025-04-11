import api from "./instance";

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
  undoLastPlacement: async (roundId:string) => {
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
};