import styles from './PlayerPanel.module.scss';
import Button from '../../../reusable/button/Button';
import TurnTimer from '../../turn-timer/TurnTimer';

import type { Player, PlayerRows } from 'gwen-common';
import GameLeftPanel from '../../ game-left-panel/GameLeftPanel';

export type PlayerPanelProps = {
  topPlayer: Player;
  topPlayerRows: PlayerRows;
  bottomPlayer: Player;
  bottomPlayerRows: PlayerRows;
  onPass: () => void;
  onResign: () => void;
  passDisabled?: boolean;
  resignDisabled?: boolean;
  topIsOpponent?: boolean;
  bottomIsOpponent?: boolean;
  topIsActiveTurn?: boolean;
  bottomIsActiveTurn?: boolean;
  topHasPassed?: boolean;
  bottomHasPassed?: boolean;
  turnStartedAt?: string | null;
};

const PlayerPanel = ({
  topPlayer,
  topPlayerRows,
  bottomPlayer,
  bottomPlayerRows,
  onPass,
  onResign,
  passDisabled = false,
  resignDisabled = false,
  topIsOpponent = true,
  bottomIsOpponent = false,
  topIsActiveTurn = false,
  bottomIsActiveTurn = false,
  topHasPassed = false,
  bottomHasPassed = false,
  turnStartedAt = null,
}: PlayerPanelProps) => {
  return (
    <div className={styles.playerPanelLayout}>
      <div className={styles.topPanel}>
        <GameLeftPanel
          player={topPlayer}
          playerRows={topPlayerRows}
          isOpponent={topIsOpponent}
          isActiveTurn={topIsActiveTurn}
          hasPlayerPassed={topHasPassed}
        />
      </div>
      <div className={styles.turnStatus}>
        <TurnTimer
          turnStartedAt={turnStartedAt}
          label={bottomIsActiveTurn ? 'Your Turn' : 'Opponent Turn'}
          playTickSound={bottomIsActiveTurn}
        />
      </div>
      <div className={styles.actionButtons}>
        <Button className={styles.passButton} onClick={onPass} disabled={passDisabled}>
          Pass
        </Button>
        <Button className={styles.resignButton} onClick={onResign} disabled={resignDisabled}>
          Resign
        </Button>
      </div>
      <div className={styles.bottomPanel}>
        <GameLeftPanel
          player={bottomPlayer}
          playerRows={bottomPlayerRows}
          isOpponent={bottomIsOpponent}
          isActiveTurn={bottomIsActiveTurn}
          hasPlayerPassed={bottomHasPassed}
        />
      </div>
    </div>
  );
};

export default PlayerPanel;
