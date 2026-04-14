import styles from './GameView.module.scss';
import UserGame from './user-game/UserGame';
import { Game, type Player } from 'gwen-common';
import { CategorisedPlayers } from '../../model/CategorisedPlayers';
import PlayerHand from '../player-hand/PlayerHand';
import { useAuthContext } from '../../contexts/AuthContext';
import Spinner from '../spinner/Spinner';
import Separator from './separator/Separator';

type GameViewProps = {
  game: Game;
};

const GameView = ({ game }: GameViewProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Spinner />;
  }

  const currentUserId = user?.id || '';

  const categorisedPlayers = categorisePlayer(game.getPlayers(), currentUserId);

  return (
    <div className={styles.gameView}>
      <UserGame
        player={categorisedPlayers.getOpponent()}
        isCurrentPlayer={currentUserId == game.getPlayers()[0].getUserId()}
      />
      <Separator />
      <UserGame
        player={categorisedPlayers.getCurrentPlayer()}
        isCurrentPlayer={currentUserId == game.getPlayers()[1].getUserId()}
      />
      <PlayerHand hand={categorisedPlayers.getCurrentPlayer().getDeck().getHand()} />
    </div>
  );
};

const categorisePlayer = (players: Player[], currentPlayerId: string): CategorisedPlayers =>
  new CategorisedPlayers(players, currentPlayerId);

export default GameView;
