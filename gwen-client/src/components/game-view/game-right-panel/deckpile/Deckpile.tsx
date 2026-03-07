import { CharacterCard } from 'gwen-common';

export type DeckpileProps = {
  remainingDeck: CharacterCard[];
};
const Deckpile = ({ remainingDeck }: DeckpileProps) => {
  return <div>remaining: {remainingDeck.length}</div>;
};

export default Deckpile;
