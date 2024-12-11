import axios, { AxiosInstance } from 'axios';


const api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
        companyId: 4,
    },

    withCredentials: true,
});


export default api;
