import UserProfilePic from '../../user-profile-pic/UserProfilePic';
import styles from './GameLeftPanel.module.scss';
import Gems from '../gem/Gems';
import type { Player, PlayerRows } from 'gwen-common';
import { useGetUser } from 'gwen-generated-api';
import ScoreBadge from '../score-badge/ScoreBadge';

export type GameLeftPanelProps = {
  isCurrentPlayer: boolean;
  player: Player;
  playerRows: PlayerRows;
};

const GameLeftPanel = ({ isCurrentPlayer, player, playerRows }: GameLeftPanelProps) => {
  const { data: user, isLoading } = useGetUser(player.getUserId());
  const factionId = player.getDeck().getFactionId();

  return (
    <div className={styles.gameLeftPanel}>
      <div className={styles.playerInfo}>
        <div className={styles.leftSection}>
          <UserProfilePic userId={player.getUserId()} />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.infoStack}>
            <div className={styles.handCount}>{player.getDeck().getHand().length}</div>
            <Gems activeCount={player.getGems()} />
          </div>
          <div className={styles.username}>{user?.username ?? 'Unknown User'}</div>
          <div className={styles.factionName}>{factionId}</div>
        </div>
        <ScoreBadge value={playerRows.getScore()} />
      </div>
    </div>
  );
};

export default GameLeftPanel;
