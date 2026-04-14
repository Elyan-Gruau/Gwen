import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';
import type { PlayCardResponse } from 'gwen-common';
import { GAMEPLAY_EVENTS } from 'gwen-common';

type GameplaySocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  joinGame: (gameId: string) => void;
  playCard: (gameId: string, cardId: string, rowType: 'MELEE' | 'RANGED' | 'SIEGE') => void;
  onGameStateUpdate: ((callback: (data: any) => void) => void) | null;
  onPlayCardResponse: ((callback: (data: PlayCardResponse) => void) => void) | null;
};

const GameplaySocketContext = createContext<GameplaySocketContextType | null>(null);

let globalSocket: Socket | null = null;

export const GameplaySocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Create the shared gameplay socket once, or reuse existing instance
    if (!globalSocket) {
      const wsBaseUrl = API_BASE_URL.replace(/\/api$/, '');
      console.log('Creating new socket connection for gameplay to', wsBaseUrl);
      globalSocket = io(wsBaseUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
    }

    const sock = globalSocket;
    setSocket(sock);

    const handleConnect = () => {
      console.log('Gameplay socket connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Gameplay socket disconnected');
      setIsConnected(false);
    };

    // Register listeners every mount (StrictMode safe)
    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);

    // If we're already connected (e.g. hot reload), sync state immediately
    if (sock.connected) {
      console.log('Gameplay socket already connected on mount');
      setIsConnected(true);
    }

    // Don't disconnect on unmount - keep the socket alive globally
    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
    };
  }, []);

  const joinGame = (gameId: string) => {
    if (globalSocket?.connected) {
      console.log('Joining game:', gameId);
      globalSocket.emit('gameplay:join-game', { gameId });
    } else {
      console.warn('Socket not connected, cannot join game. isConnected:', isConnected);
    }
  };

  const playCard = (gameId: string, cardId: string, rowType: 'MELEE' | 'RANGED' | 'SIEGE') => {
    if (globalSocket?.connected) {
      console.log('Playing card:', { gameId, cardId, rowType });
      globalSocket.emit(GAMEPLAY_EVENTS.PLAY_CARD, {
        gameId,
        cardId,
        rowType,
      });
    } else {
      console.warn('Socket not connected, cannot play card');
    }
  };

  const onGameStateUpdate = (callback: (data: any) => void) => {
    if (globalSocket) {
      globalSocket.on(GAMEPLAY_EVENTS.GAME_STATE_UPDATED, callback);
    }
  };

  const onPlayCardResponse = (callback: (data: PlayCardResponse) => void) => {
    if (globalSocket) {
      globalSocket.on(GAMEPLAY_EVENTS.PLAY_CARD_RESPONSE, callback);
    }
  };

  return (
    <GameplaySocketContext.Provider
      value={{
        socket,
        isConnected,
        joinGame,
        playCard,
        onGameStateUpdate,
        onPlayCardResponse,
      }}
    >
      {children}
    </GameplaySocketContext.Provider>
  );
};

export const useGameplaySocket = () => {
  const context = useContext(GameplaySocketContext);
  if (!context) {
    throw new Error('useGameplaySocket must be used within GameplaySocketProvider');
  }
  return context;
};
