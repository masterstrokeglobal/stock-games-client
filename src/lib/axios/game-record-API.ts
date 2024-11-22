import api from "./instance";

export const gameRecordAPI = {
  createGameRecord: async (data: any) => {
    return api.post("/game-record", data);
  },

  getWinningGameRecord: async () => {
    return api.get("/game-record/winning");
  },

  getTopPlacements: async () => {
    return api.get("/game-record/top-placements");
  },

  getMyPlacements: async () => {
    return api.get("/game-record/my-placements");
  }
};