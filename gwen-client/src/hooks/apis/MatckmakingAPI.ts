import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  MATCHMAKING_FOUND,
  MATCHMAKING_JOIN,
  MATCHMAKING_JOINED,
  MATCHMAKING_LEAVE,
  MATCHMAKING_POOL_SIZE,
} from 'gwen-common';
import { getGameURL } from '../../utils/URLProvider';
import { API_BASE_URL } from '../../constants/api';

const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, '');

export type UseMatchmakingResult = {
  isSearching: boolean;
  queuePosition: number;
  poolSize: number;
  searchRange?: { minElo: number; maxElo: number; range: number } | null;
  searchTimeMs: number;
  joinMatchmakingPool: (deckId?: string) => void;
  leaveMatchmakingPool: () => void;
};

export const useMatchmaking = (userId: string | null): UseMatchmakingResult => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [poolSize, setPoolSize] = useState(0);
  const [searchRange, setSearchRange] = useState<{
    minElo: number;
    maxElo: number;
    range: number;
  } | null>(null);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [searchTimeMs, setSearchTimeMs] = useState(0);
  const [userElo, setUserElo] = useState(1200); // default ELO

  useEffect(() => {
    if (!userId) {
      return;
    }

    const newSocket = io(SOCKET_BASE_URL, {
      auth: { userId },
    });

    // Server events
    newSocket.on(MATCHMAKING_JOINED, (data) => {
      setIsSearching(true);
      setQueuePosition(data.position);
      setSearchRange(data.searchRange || null);
      setUserElo(
        data.searchRange?.minElo ? (data.searchRange.minElo + data.searchRange.maxElo) / 2 : 1200,
      );
      setSearchStartTime(Date.now());
    });

    newSocket.on(MATCHMAKING_POOL_SIZE, (data) => {
      setPoolSize(data.size ?? 0);
    });

    newSocket.on(MATCHMAKING_FOUND, (data) => {
      // Redirect to game page
      window.location.href = getGameURL(data.gameId);
    });

    setSocket(newSocket);

    const handleBeforeUnload = () => {
      // Notify the server that the user is leaving the queue
      newSocket.emit(MATCHMAKING_LEAVE, { userId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Notify the server that the user is leaving the queue
      newSocket.emit(MATCHMAKING_LEAVE, { userId });
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Then close the socket connection
      newSocket.disconnect();
    };
  }, [userId]);

  // Update search time and range every 500ms
  useEffect(() => {
    if (!isSearching || !searchStartTime) {
      return;
    }

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - searchStartTime;
      setSearchTimeMs(elapsedMs);

      // Calculate expanding range
      const range = 100 + Math.floor(elapsedMs / 5000) * 50;
      setSearchRange({
        minElo: Math.max(0, userElo - range),
        maxElo: userElo + range,
        range,
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isSearching, searchStartTime, userElo]);

  const joinMatchmakingPool = (deckId?: string) => {
    socket?.emit(MATCHMAKING_JOIN, {
      userId,
      deckId,
    });
  };

  const leaveMatchmakingPool = () => {
    socket?.emit(MATCHMAKING_LEAVE, { userId });
    setIsSearching(false);
    setSearchStartTime(null);
    setSearchRange(null);
    setSearchTimeMs(0);
  };

  return {
    isSearching,
    queuePosition,
    joinMatchmakingPool,
    leaveMatchmakingPool,
    poolSize,
    searchRange,
    searchTimeMs,
  };
};
