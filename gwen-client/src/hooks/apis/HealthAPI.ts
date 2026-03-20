import { useQuery } from '@tanstack/react-query';
import type { HealthStatusDTO } from 'gwen-generated-api';
import { StatusApi } from 'gwen-generated-api';
import { API_BASE_URL } from '../../constants/api';

// Create a single instance of the Status API
const statusApi = new StatusApi(API_BASE_URL);

export const useServerHealth = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['serverHealth'],
    queryFn: async (): Promise<HealthStatusDTO> => {
      return statusApi.getHealth();
    },
    enabled,
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
    retryDelay: 1000,
  });
};
