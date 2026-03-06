// --- Types de base ---

export type CardType = 'melee' | 'range' | 'siege' | 'special';

export type AbilityType =
  | 'spy'      // Se joue chez l'adversaire, pioche 2 cartes
  | 'medic'    // Ressuscite une carte du cimetiere
  | 'morale'   // +1 a toutes les cartes de la meme rangee (pas elle-meme)
  | 'bond'     // Double la puissance si 2+ copies sur la meme rangee
  | 'scorch'   // Detruit la carte la plus forte en jeu
  | 'decoy'    // Remplace une carte posee pour la reprendre en main
  | 'muster'   // Pioche toutes les cartes du meme nom depuis le deck
  | 'agile'    // Peut etre placee en melee ou range
  | 'weather'  // Applique une meteo sur une rangee
  | 'none';

// --- Carte ---

export interface Card {
  id: string;
  name: string;
  description?: string;
  power: number;
  type: CardType;
  ability: AbilityType;
  isHero: boolean; // Immunisee aux effets meteo et scorch
}

// --- Rangee ---

export interface Row {
  type: Exclude<CardType, 'special'>;
  cards: Card[];
  weatherActive: boolean; // Reduit toutes les cartes non-heros a 1
}

// --- Plateau ---

export interface PlayerBoard {
  melee: Row;
  range: Row;
  siege: Row;
}

// --- Joueur ---

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  deck: Card[];
  graveyard: Card[];
  lives: number;      // Commence a 2, perd 1 a chaque manche perdue
  hasPassed: boolean; // A passe son tour pour cette manche
  board: PlayerBoard;
}

// --- Manche ---

export interface Round {
  roundNumber: number;
  scores: Record<string, number>; // playerId -> score
  winnerId: string | null;        // null = egalite
  isFinished: boolean;
}

// --- Phase de jeu ---

export type GamePhase =
  | 'waiting'    // En attente de joueurs
  | 'redraw'     // Phase d'echange de cartes en debut de partie
  | 'playing'    // Manche en cours
  | 'round_end'  // Fin de manche, resolution
  | 'game_over'; // Partie terminee

// --- Etat global de la partie ---

export interface GameState {
  id: string;
  players: [Player, Player];
  rounds: Round[];
  currentRound: number;
  activePlayerId: string;
  phase: GamePhase;
  createdAt: number;
  updatedAt: number;
}
