import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete']);

api.interceptors.response.use(
    (response) => {
        if (MUTATION_METHODS.has(response.config.method?.toLowerCase())) {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('api:mutate'));
            }
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default api;
