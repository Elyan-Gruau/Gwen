import { Deck } from 'gwen-common';
import DiscardedPile from './discarded-view/DiscardedPile';
import DrawPile from './draw-pile/DrawPile';

export type GameRightPanelProps = {
  deck: Deck;
  factionId: string; //TODO use context to avoid props drilling
};

const GameRightPanel = ({ deck, factionId }: GameRightPanelProps) => {
  return (
    <div>
      <DiscardedPile factionId={factionId} discarded={deck.getDiscarded()} />
      <DrawPile factionId={factionId} drawPile={deck.getDrawPile()} />
    </div>
  );
};

export default GameRightPanel;
