import axios from 'axios';

// Create axios instance with interceptor to add token to all requests
const axiosInstance = axios.create();

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
