import { useMutation } from '@tanstack/react-query';
import { AuthApi } from 'gwen-generated-api';
import type { LoginRequestDTO, RegisterRequestDTO, AuthResponseDTO } from 'gwen-generated-api';

// Créer une instance unique de l'API Auth
const authApi = new AuthApi(import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

/**
 * Hook pour se connecter
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequestDTO) => {
      const response = await authApi.login(credentials);
      // Sauvegarder le token si la connexion réussit
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        authApi.setToken(response.token);
      }
      return response;
    },
  });
};

/**
 * Hook pour s'inscrire
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequestDTO) => {
      const response = await authApi.register(data);
      // Sauvegarder le token si l'inscription réussit
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        authApi.setToken(response.token);
      }
      return response;
    },
  });
};

/**
 * Initialiser le token depuis le localStorage au démarrage
 */
export const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    authApi.setToken(token);
  }
};

/**
 * Déconnecter l'utilisateur
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  authApi.clearToken();
};
