import axios from 'axios';
import TokenManager from './TokenManager.js';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

const PUBLIC_ENDPOINTS = ['/login/user', '/student/register'];

api.interceptors.request.use(
    async (config) => {
      const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) => config.url.endsWith(url));

      if (isPublicEndpoint) {
        return config;
      }

      try {
        const token = await TokenManager.getValidAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error)
);


export default api;
