import axios, { AxiosInstance } from 'axios';
import { COMPANYID } from '../utils';


const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
        companyId: COMPANYID,
    },

    withCredentials: true,
});


export default api;
