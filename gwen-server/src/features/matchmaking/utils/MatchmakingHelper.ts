import type { Server } from 'socket.io';
import type { UserService } from '../../auth/services/UserService';
import type { GameService } from '../../game/services/GameService';
import type { UserFactionDeckService } from '../../auth/services/UserFactionDeckService';
import { GameManager } from '../../game/services/GameManager.js';
import { MatchmakingService } from '../services/MatchmakingService';
import { MatchmakingGateway } from '../MatchmakingGateway';

export function initializeMatchmaking(
  io: Server,
  userService: UserService,
  gameService: GameService,
  userFactionDeckService: UserFactionDeckService,
) {
  const gameManager = GameManager.getInstance();

  const matchmakingService = new MatchmakingService(userService, gameService);
  const matchmakingGateway = new MatchmakingGateway(
    io,
    matchmakingService,
    userService,
    userFactionDeckService,
  );

  return { matchmakingService, matchmakingGateway, gameManager };
}
