import { Deck } from 'gwen-common';
import DiscardedPile from './discarded-view/DiscardedPile';
import DrawPile from './draw-pile/DrawPile';
import styles from './GameRightPanel.module.scss';

export type GameRightPanelProps = {
  deck: Deck;
  factionId: string; //TODO use context to avoid props drilling
};

const GameRightPanel = ({ deck, factionId }: GameRightPanelProps) => {
  return (
    <div className={styles.container}>
      <DiscardedPile factionId={factionId} discarded={deck.getDiscarded()} />
      <DrawPile factionId={factionId} drawPile={deck.getDrawPile()} />
    </div>
  );
};

export default GameRightPanel;
