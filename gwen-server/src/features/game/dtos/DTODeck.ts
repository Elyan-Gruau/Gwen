export interface DTOPlayableCard {
  id: string;
}

export interface DTODeck {
  drawPile: DTOPlayableCard[];
  hand: DTOPlayableCard[];
  discardPile: DTOPlayableCard[];
  leader: DTOPlayableCard;
  factionId: string;
}
