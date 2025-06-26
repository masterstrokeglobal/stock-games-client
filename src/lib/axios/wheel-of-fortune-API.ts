import api from "./instance";
import { WheelColor, WheelOfFortunePlacement } from "@/models/wheel-of-fortune-placement";
const wheelOfFortuneAPI = {
    createWheelOfFortunePlacement: async (data: {roundId: number, amount: number, placementColor: WheelColor}) => {
        const response = await api.post("/wheel-of-fortune/", data);
        return response.data;
    },
    getMyCurrentRoundWheelOfFortunePlacement: async (roundId: number) : Promise<WheelOfFortunePlacement[]> => {
        const response = await api.get(`/wheel-of-fortune/my-current-placement/${roundId}`);
        return response.data.data.map((placement: WheelOfFortunePlacement) => new WheelOfFortunePlacement(placement));
    },
    getCurrentRoundWheelOfFortunePlacement: async (roundId: number) => {
        const response = await api.get(`/wheel-of-fortune/current-round-placements/${roundId}`);
        return response.data;
    },
    getWheelOfFortuneRoundResult: async (roundId: number) => {
        const response = await api.get(`/wheel-of-fortune/result/${roundId}`);
        return response.data;
    }
}

export default wheelOfFortuneAPI;