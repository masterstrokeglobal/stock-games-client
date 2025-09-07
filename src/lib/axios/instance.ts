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

// Attach Authorization header (Bearer token) for admin/operator requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            (config.headers as any)['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (typeof window !== 'undefined' && (status === 401 || status === 403)) {
            try {
                localStorage.removeItem('token');
            } catch {}
        }
        return Promise.reject(error);
    }
);

export default api;
