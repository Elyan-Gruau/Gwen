import { Deck } from 'gwen-common';
import DiscardedPile from './discarded-view/DiscardedPile';
import Deckpile from './deckpile/Deckpile';

export type GameRightPanelProps = {
  deck: Deck;
};

const GameRightPanel = ({ deck }: GameRightPanelProps) => {
  // Display the remaining deck & the fosse
  return (
    <div>
      <DiscardedPile discarded={deck.getDiscarded()} />
      <Deckpile remainingDeck={deck.getPioche()} />
    </div>
  );
};

export default GameRightPanel;
