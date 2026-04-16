import GameRightPanel from '../../game-right-panel/GameRightPanel';
import type { Player } from 'gwen-common';
import styles from './DeckPanel.module.scss';

export type DeckPanelProps = {
  opponent: Player;
  player: Player;
};

const DeckPanel = ({ opponent, player }: DeckPanelProps) => {
  return (
    <div className={styles.deckPanelLayout}>
      <div className={styles.topPanel}>
        <GameRightPanel deck={opponent.getDeck()} factionId={opponent.getDeck().getFactionId()} />
      </div>
      <div className={styles.bottomPanel}>
        <GameRightPanel deck={player.getDeck()} factionId={player.getDeck().getFactionId()} />
      </div>
    </div>
  );
};

export default DeckPanel;
