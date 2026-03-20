import { useQuery } from '@tanstack/react-query';

import { API_BASE_URL } from '../../constants/api';
import { AuthApi, type UserDTO } from 'gwen-generated-api';

// Create a single instance of the Auth API
const authApi = new AuthApi(API_BASE_URL);

/**
 * Hook to fetch a user by ID
 * @param userId - The user ID to fetch
 * @returns Query result with user data
 */
export const useGetUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<UserDTO> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return authApi.getUser(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
