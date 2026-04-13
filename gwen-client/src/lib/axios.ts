// src/lib/axios.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { logout as logoutUser } from '../hooks/apis/AuthAPI';
import { router } from '../router';
import { ROUTES } from '../constants/routes';

axios.defaults.baseURL = API_BASE_URL;

// Inject the jwt token on every request based on localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global handler for 401 errors (expired/invalid token)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      const requestUrl: string | undefined = error.config?.url;

      // Ne pas traiter les erreurs "normales" des endpoints d'auth (login / register)
      if (requestUrl && /\/auth\/(login|register)/.test(requestUrl)) {
        return Promise.reject(error);
      }

      // Nettoyer le token côté client
      logoutUser();

      // Rediriger l'utilisateur vers la page de login si ce n'est pas déjà le cas
      if (window.location.pathname !== ROUTES.LOGIN) {
        router.navigate(ROUTES.LOGIN, { replace: true });
      }
    }

    return Promise.reject(error);
  },
);

