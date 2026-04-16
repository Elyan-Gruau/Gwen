import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useResignGame = () =>
  useMutation({
    mutationFn: ({ gameId, playerId }: { gameId: string; playerId: string }) =>
      axios.post(`/games/${gameId}/resign`, { playerId }).then((r) => r.data),
  });
