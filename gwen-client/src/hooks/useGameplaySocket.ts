import { useEffect, useCallback } from 'react';
import { useGameplaySocket as useGameplaySocketContext } from '../contexts/GameplaySocketContext';
import type { PlayCardResponse } from 'gwen-common';
import { GAMEPLAY_EVENTS } from 'gwen-common';

type UseGameplaySocketProps = {
  gameId: string;
  onGameStateUpdate?: (data: any) => void;
  onPlayCardResponse?: (data: PlayCardResponse) => void;
};

export const useGameplaySocket = ({
  gameId,
  onGameStateUpdate,
  onPlayCardResponse,
}: UseGameplaySocketProps) => {
  const { joinGame, playCard: contextPlayCard, isConnected, socket } = useGameplaySocketContext();

  // Join the game room when the component mounts or when the socket becomes connected
  useEffect(() => {
    if (!isConnected || !gameId) {
      console.log('Not joining game yet:', { isConnected, gameId });
      return;
    }

    console.log('Joining game because isConnected changed:', gameId);
    joinGame(gameId);
  }, [gameId, isConnected, joinGame]);

  // Set up listeners for game state updates and play card responses
  useEffect(() => {
    if (!socket) {
      console.log('Socket not available for setting up listeners');
      return;
    }

    if (onGameStateUpdate) {
      console.log('Setting up GAME_STATE_UPDATED listener');
      socket.on(GAMEPLAY_EVENTS.GAME_STATE_UPDATED, onGameStateUpdate);
    }

    if (onPlayCardResponse) {
      console.log('Setting up PLAY_CARD_RESPONSE listener');
      socket.on(GAMEPLAY_EVENTS.PLAY_CARD_RESPONSE, onPlayCardResponse);
    }

    return () => {
      if (onGameStateUpdate) {
        socket.off(GAMEPLAY_EVENTS.GAME_STATE_UPDATED);
      }
      if (onPlayCardResponse) {
        socket.off(GAMEPLAY_EVENTS.PLAY_CARD_RESPONSE);
      }
    };
  }, [socket, onGameStateUpdate, onPlayCardResponse]);

  // Wrapper function to play a card
  const playCard = useCallback(
    (cardId: string, rowType: 'MELEE' | 'RANGED' | 'SIEGE') => {
      contextPlayCard(gameId, cardId, rowType);
    },
    [gameId, contextPlayCard],
  );

  return { playCard, isConnected };
};
