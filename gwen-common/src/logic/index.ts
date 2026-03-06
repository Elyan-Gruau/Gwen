import type { Row, PlayerBoard, Player, Round, GameState } from '../types/index.js';
import { WEATHER_POWER } from '../constants/index.js';

// --- Score d'une rangee ---

/**
 * Calcule le score d'une rangee.
 * Si la meteo est active, les cartes non-heros valent WEATHER_POWER.
 */
export function calculateRowScore(row: Row): number {
  return row.cards.reduce((total, card) => {
    const effectivePower =
      row.weatherActive && !card.isHero ? WEATHER_POWER : card.power;
    return total + effectivePower;
  }, 0);
}

// --- Score total d'un plateau ---

/**
 * Calcule le score total d'un plateau (somme des 3 rangees).
 */
export function calculateBoardScore(board: PlayerBoard): number {
  return (
    calculateRowScore(board.melee) +
    calculateRowScore(board.range) +
    calculateRowScore(board.siege)
  );
}

// --- Gagnant d'une manche ---

/**
 * Determine le gagnant d'une manche a partir des scores.
 * Retourne l'id du joueur gagnant, ou null en cas d'egalite.
 */
export function determineRoundWinner(
  scores: Record<string, number>
): string | null {
  const entries = Object.entries(scores);
  if (entries.length !== 2) return null;

  const [a, b] = entries;
  if (a[1] > b[1]) return a[0];
  if (b[1] > a[1]) return b[0];
  return null; // egalite -> les deux perdent une vie
}

// --- Fin de partie ---

/**
 * Retourne l'id du joueur gagnant si la partie est terminee, sinon null.
 * Un joueur gagne quand son adversaire n'a plus de vies.
 */
export function getGameWinner(players: [Player, Player]): string | null {
  for (const player of players) {
    if (player.lives <= 0) {
      const opponent = players.find((p) => p.id !== player.id);
      return opponent?.id ?? null;
    }
  }
  return null;
}

/**
 * Indique si la partie est terminee.
 */
export function isGameOver(players: [Player, Player]): boolean {
  return getGameWinner(players) !== null;
}

// --- Fin de manche ---

/**
 * Indique si la manche en cours est terminee
 * (les deux joueurs ont passe ou n'ont plus de cartes en main).
 */
export function isRoundOver(players: [Player, Player]): boolean {
  return players.every((p) => p.hasPassed || p.hand.length === 0);
}

// --- Resolution d'une manche ---

/**
 * Calcule les scores et determine le gagnant d'une manche.
 * Retourne une Round sans modifier l'etat (fonction pure).
 */
export function resolveRound(
  players: [Player, Player],
  roundNumber: number
): Round {
  const scores: Record<string, number> = {};
  for (const player of players) {
    scores[player.id] = calculateBoardScore(player.board);
  }
  return {
    roundNumber,
    scores,
    winnerId: determineRoundWinner(scores),
    isFinished: true,
  };
}

// --- Validation ---

/**
 * Verifie qu'un joueur peut encore jouer (pas passe, cartes en main).
 */
export function canPlayerAct(player: Player): boolean {
  return !player.hasPassed && player.hand.length > 0;
}

/**
 * Retourne le joueur actif suivant (alterne entre les deux joueurs,
 * en sautant ceux qui ont passe ou n'ont plus de cartes).
 */
export function getNextActivePlayer(state: GameState): string | null {
  const [p1, p2] = state.players;
  const current = state.players.find((p) => p.id === state.activePlayerId);
  if (!current) return null;

  const opponent = current.id === p1.id ? p2 : p1;

  if (canPlayerAct(opponent)) return opponent.id;
  if (canPlayerAct(current)) return current.id;
  return null; // les deux ont passe -> fin de manche
}

