import axios, { AxiosInstance } from 'axios';


const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
        companyId: process.env.NEXT_PUBLIC_COMPANY_ID ?? 4,
    },

    withCredentials: true,
});


export default api;
