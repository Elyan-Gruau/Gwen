import { type PlayableCard, UnitCard } from 'gwen-common';

export type DeckpileProps = {
  remainingDeck: PlayableCard[];
};
const Deckpile = ({ remainingDeck }: DeckpileProps) => {
  return <div>remaining: {remainingDeck.length}</div>;
};

export default Deckpile;
