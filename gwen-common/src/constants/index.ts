import type {CardType} from '../types/index.js'

// --- Regles de base ---

/** Nombre de vies initiales par joueur */
export const INITIAL_LIVES = 2

/** Nombre de manches pour gagner la partie (premier a perdre toutes ses vies) */
export const TOTAL_ROUNDS = 3

/** Nombre de cartes en main au debut de la partie */
export const INITIAL_HAND_SIZE = 10

/** Nombre de cartes echangeables en debut de partie (redraw) */
export const MAX_REDRAW_COUNT = 2

/** Taille minimale d'un deck */
export const MIN_DECK_SIZE = 22

// --- Rangees ---

export const ROW_TYPES: Exclude<CardType, 'special'>[] = ['melee', 'range', 'siege']

// --- Scores ---

/** Valeur d'une carte affectee par la meteo (non-heros) */
export const WEATHER_POWER = 1
