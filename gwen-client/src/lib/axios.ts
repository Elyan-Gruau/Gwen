// src/lib/axios.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

axios.defaults.baseURL = API_BASE_URL;

// Inject the jwt token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
