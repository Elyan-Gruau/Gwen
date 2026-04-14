import UserView from '../../user-view/UserView';
import LeaderSlot from '../leader-slot/LeaderSlot';
import styles from './GameLeftPanel.module.scss';
import Gems from '../gem/Gems';
import type { Player, PlayerRows } from 'gwen-common';
import PlayerScore from '../player-score/PlayerScore';

export type GameLeftPanelProps = {
  isCurrentPlayer: boolean;
  player: Player;
  playerRows: PlayerRows;
};

const GameLeftPanel = ({ isCurrentPlayer, player, playerRows }: GameLeftPanelProps) => {
  return (
    <div className={styles.gameLeftPanel}>
      <UserView userId={player.getUserId()} />
      <Gems activeCount={player.getGems()} />
      HandCount : {player.getDeck().getHand().length}
      <PlayerScore playerRows={playerRows} />
      <LeaderSlot />
    </div>
  );
};

export default GameLeftPanel;
