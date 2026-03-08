import { UnitCard } from 'gwen-common';

export type DeckpileProps = {
  remainingDeck: UnitCard[];
};
const Deckpile = ({ remainingDeck }: DeckpileProps) => {
  return <div>remaining: {remainingDeck.length}</div>;
};

export default Deckpile;
