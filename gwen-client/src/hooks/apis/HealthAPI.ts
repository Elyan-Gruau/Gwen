import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const useServerHealth = (enabled: boolean = true) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  return useQuery({
    queryKey: ['serverHealth'],
    queryFn: async () => {
      const response = await axios.get<HealthStatus>(`${apiUrl}/health`);
      return response.data;
    },
    enabled,
    refetchInterval: 5000, // Refresh all 5 seconds
    retry: 3,
    retryDelay: 1000,
  });
};

