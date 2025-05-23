import api from "./instance";

const favoriteMarketItemAPI = {
    addToFavorites: async (marketItemId: number) => {
        return api.post(`/favourite`, { marketItemId });
    },
    getMyFavorites: async () => {
        return api.get(`/favourite`);
    },
};

export default favoriteMarketItemAPI;
