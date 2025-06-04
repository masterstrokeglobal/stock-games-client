import api from "./instance";

export const advanceGameRecordAPI = {
  createAdvanceGameRecord: async (data: any) => {
    return api.post("/advance-game-records", data);
  }
};