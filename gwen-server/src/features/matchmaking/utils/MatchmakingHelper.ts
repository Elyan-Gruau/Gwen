import type { Server } from 'socket.io';
import type { UserService } from '../../auth/services/UserService';
import type { GameService } from '../../game/services/GameService';
import { MatchmakingService } from '../services/MatchmakingService';
import { MatchmakingGateway } from '../MatchmakingGateway';

export function initializeMatchmaking(
  io: Server,
  userService: UserService,
  gameService: GameService,
) {
  const matchmakingService = new MatchmakingService(userService, gameService);
  const matchmakingGateway = new MatchmakingGateway(io, matchmakingService);

  console.log('✅ Matchmaking system initialized');

  return { matchmakingService, matchmakingGateway };
}
