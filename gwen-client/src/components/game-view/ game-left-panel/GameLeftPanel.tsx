import UserProfilePic from '../../user-profile-pic/UserProfilePic';
import styles from './GameLeftPanel.module.scss';
import Gems from '../gem/Gems';
import type { Player, PlayerRows } from 'gwen-common';
import { useGetUser } from 'gwen-generated-api';
import ScoreBadge from '../score-badge/ScoreBadge';

export type GameLeftPanelProps = {
  player: Player;
  playerRows: PlayerRows;
  isOpponent?: boolean;
  isActiveTurn?: boolean;
  hasPlayerPassed?: boolean;
};

const GameLeftPanel = ({
  player,
  playerRows,
  isOpponent = false,
  isActiveTurn = false,
  hasPlayerPassed = false,
}: GameLeftPanelProps) => {
  const { data: user } = useGetUser(player.getUserId());
  const factionId = player.getDeck().getFactionId();

  return (
    <div className={styles.gameLeftPanel}>
      <div className={`${styles.playerInfo} ${isActiveTurn ? styles.activeGlow : ''}`}>
        <div className={styles.leftSection}>
          <UserProfilePic userId={player.getUserId()} size={'large'} />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.infoStack}>
            <div className={styles.handCount}>{player.getDeck().getHand().length}</div>
            <Gems activeCount={player.getGems()} />
          </div>
          <div className={styles.username}>{user?.username ?? 'Unknown User'}</div>
          <div className={styles.factionName}>{factionId}</div>
          {hasPlayerPassed && <div className={styles.passedPill}>Passed</div>}
        </div>
        <ScoreBadge value={playerRows.getScore()} isOpponent={isOpponent} />
      </div>
    </div>
  );
};

export default GameLeftPanel;
