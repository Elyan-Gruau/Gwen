import axios from 'axios';

const AUTH_TOKEN_KEY = 'authToken';

/**
 * Applique le token JWT à toutes les requêtes axios du client généré Orval.
 */
const setAxiosAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

/**
 * Initialiser le token depuis le localStorage au démarrage
 */
export const initializeAuth = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    setAxiosAuthToken(token);
  }
};

/**
 * Déconnecter l'utilisateur
 */
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  setAxiosAuthToken(null);
};

/**
 * Enregistre un nouveau token (par exemple après login/register)
 */
export const persistAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  setAxiosAuthToken(token);
};
