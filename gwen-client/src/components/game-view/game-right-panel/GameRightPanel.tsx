import { Deck } from 'gwen-common';
import DiscardedPile from './discarded-view/DiscardedPile';
import DrawPile from './draw-pile/DrawPile';

export type GameRightPanelProps = {
  deck: Deck;
};

const GameRightPanel = ({ deck }: GameRightPanelProps) => {
  // Display the remaining deck & the fosse
  return (
    <div>
      <DiscardedPile discarded={deck.getDiscarded()} />
      <DrawPile drawPile={deck.getDrawPile()} />
    </div>
  );
};

export default GameRightPanel;
