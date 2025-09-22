import axios from 'axios';
import { API_BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 80000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor for handling responses
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response) {
            if (error.response.status === 500) {
                console.error("Server error. Please try again later")
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("A timeout has occurred. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
