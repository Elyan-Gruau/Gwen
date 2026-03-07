import UserView from '../../user-view/UserView';
import LeaderSlot from '../leader-slot/LeaderSlot';
import styles from './GameLeftPanel.module.scss';
import Gems from '../gem/Gems';
import type { Player } from 'gwen-common';

export type GameLeftPanelProps = {
  isCurrentPlayer: boolean;
  player: Player;
};

const GameLeftPanel = ({ isCurrentPlayer, player }: GameLeftPanelProps) => {
  const fakeNickname = isCurrentPlayer ? 'You' : 'Opponent';
  return (
    <div className={styles.gameLeftPanel}>
      <UserView userId={player.getUserId()} nickname={fakeNickname} />
      <Gems activeCount={player.getGems()} />
      HandCount : {player.getDeck().getHand().length}
      <LeaderSlot />
    </div>
  );
};

export default GameLeftPanel;
