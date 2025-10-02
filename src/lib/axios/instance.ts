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

// Add request interceptor to dynamically set sessionId in custom header
api.interceptors.request.use(
    (config) => {
        // Only set custom session header if we're in a browser environment
        if (typeof window !== 'undefined') {
            const sessionId = sessionStorage.getItem('sessionId');
            if (sessionId && sessionId !== 'null' && sessionId !== 'undefined') {
                config.headers['X-Session-ID'] = sessionId;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
