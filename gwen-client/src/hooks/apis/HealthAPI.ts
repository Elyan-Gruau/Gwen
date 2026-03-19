import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const useServerHealth = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['serverHealth'],
    queryFn: async () => {
      const response = await axios.get<HealthStatus>(`${API_BASE_URL}/health`);
      return response.data;
    },
    enabled,
    refetchInterval: 5000, // Refresh all 5 seconds
    retry: 3,
    retryDelay: 1000,
  });
};
