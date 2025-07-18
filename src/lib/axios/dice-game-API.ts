import api from "./instance";
import { DicePlacementType } from "@/models/dice-placement";

const diceGameAPI = {
    createDiceGamePlacement: async (placementData: {
        roundId: number;
        amount: number;
        number: number;
        placementType: DicePlacementType;
    }) => {
        return api.post("/dice-placement", placementData);
    },
    getMyCurrentRoundDiceGamePlacement: async (roundId: number) => {
        return api.get(`/dice-placement/my-current-placement/${roundId}`);
    },
    getCurrentRoundDiceGamePlacement: async (roundId: number) => {
        return api.get(`/dice-placement/current-round-placements/${roundId}`);
    },
    getDiceGameRoundResult: async (roundId: number) => {
        return api.get(`/dice-placement/result/${roundId}`);
    }
}

export default diceGameAPI;