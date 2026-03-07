import UserView from '../../user-view/UserView';
import LeaderEffect from '../leader-effect/LeaderEffect';
import LeaderSlot from '../leader-slot/LeaderSlot';
import styles from './GameLeftPanel.module.scss';

export type GameLeftPanelProps = {
  isCurrentPlayer: boolean;
};

const GameLeftPanel = ({ isCurrentPlayer }: GameLeftPanelProps) => {
  return (
    <div className={styles.gameLeftPanel}>
      <UserView />
      <LeaderEffect />
      <LeaderSlot />
    </div>
  );
};

export default GameLeftPanel;
