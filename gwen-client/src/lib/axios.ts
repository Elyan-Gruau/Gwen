// src/lib/axios.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { logout as logoutUser } from '../hooks/apis/AuthAPI';
import { router } from '../router';
import { ROUTES } from '../constants/routes';

axios.defaults.baseURL = API_BASE_URL;

// Log every outgoing request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const hasToken = !!token;
  console.log('[AXIOS][REQUEST]', config.method?.toUpperCase(), config.url, {
    hasToken,
    headers: config.headers,
  });
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Log every received response (success or error)
axios.interceptors.response.use(
  (response) => {
    console.log(
      '[AXIOS][RESPONSE][SUCCESS]',
      response.config.method?.toUpperCase(),
      response.config.url,
      {
        status: response.status,
        data: response.data,
      },
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl: string | undefined = error.config?.url;
    console.error('[AXIOS][RESPONSE][ERROR]', error.config?.method?.toUpperCase(), requestUrl, {
      status,
      message: error.message,
      data: error.response?.data,
    });
    if (status === 401) {
      // Do not handle normal errors from auth endpoints (login / register)
      if (requestUrl && /\/auth\/(login|register)/.test(requestUrl)) {
        return Promise.reject(error);
      }

      // Clean up the token on the client side
      logoutUser();

      // Redirect the user to the login page if not already there
      if (window.location.pathname !== ROUTES.LOGIN) {
        console.warn('[AXIOS][401] Redirecting to login page');
        router.navigate(ROUTES.LOGIN, { replace: true });
      }
    }

    return Promise.reject(error);
  },
);
