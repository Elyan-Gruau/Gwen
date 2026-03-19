import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  MATCHMAKING_FOUND,
  MATCHMAKING_JOIN,
  MATCHMAKING_JOINED,
  MATCHMAKING_LEAVE,
} from 'gwen-common';

export const useMatchmaking = (userId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const newSocket = io('http://localhost:3000', {
      auth: { userId },
    });

    // Server events
    newSocket.on(MATCHMAKING_JOINED, (data) => {
      setIsSearching(true);
      setQueuePosition(data.position);
    });

    newSocket.on(MATCHMAKING_FOUND, (data) => {
      // Redirect to game page
      window.location.href = `/game/${data.gameId}`;
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const joinQueue = (faction: string) => {
    socket?.emit(MATCHMAKING_JOIN, {
      userId,
      elo: 1200, // TODO: get it from the player
      faction,
    });
  };

  const leaveQueue = () => {
    socket?.emit(MATCHMAKING_LEAVE, { userId });
    setIsSearching(false);
  };

  return {
    isSearching,
    queuePosition,
    joinQueue,
    leaveQueue,
  };
};
