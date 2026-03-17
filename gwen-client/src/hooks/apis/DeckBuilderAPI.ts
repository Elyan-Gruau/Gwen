import { useMutation, useQuery } from '@tanstack/react-query';
import type { UpdateUserFactionDeckRequestDTO } from 'gwen-generated-api';
import { UserFactionDeckApi } from 'gwen-generated-api';
import { useAuth } from '../../contexts/AuthContext';

const deckApi = new UserFactionDeckApi(import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

interface SaveDeckData {
  factionId: string;
  leaderCardId: string | null;
  unitCardIds: string[];
  specialCardIds: string[];
}

export const useLoadUserFactionDeck = (factionId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userFactionDeck', user?._id, factionId],
    queryFn: async () => {
      if (!user?._id || !factionId) {
        return null;
      }

      try {
        return await deckApi.getUserFactionDeck(user._id, factionId);
      } catch {
        // The deck does not exists
        return null;
      }
    },
    enabled: !!user?._id && !!factionId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useSaveUserFactionDeck = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: SaveDeckData) => {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      const payload: UpdateUserFactionDeckRequestDTO = {
        leaderCardId: data.leaderCardId,
        unitCardIds: data.unitCardIds,
        specialCardIds: data.specialCardIds,
      };

      // Try to update first
      try {
        return await deckApi.updateUserFactionDeck(user._id, data.factionId, payload);
      } catch (error: unknown) {
        // If not found, create it instead
        if (error instanceof Error && error.message.includes('404')) {
          return await deckApi.createUserFactionDeck(user._id, {
            factionId: data.factionId,
          });
        }
        throw error;
      }
    },
  });
};
