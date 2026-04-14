import styles from './GameView.module.scss';
import UserGame from './user-game/UserGame';
import { Game, type Player, type PlayerRows } from 'gwen-common';
import { CategorisedPlayers } from '../../model/CategorisedPlayers';
import PlayerHand from '../player-hand/PlayerHand';
import { useAuthContext } from '../../contexts/AuthContext';
import Spinner from '../spinner/Spinner';
import Separator from './separator/Separator';

type GameViewProps = {
  game: Game;
  gameId: string;
};

const GameView = ({ game, gameId }: GameViewProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Spinner />;
  }

  const currentUserId = user?.id || '';

  const categorisedPlayers = categorisePlayer(game.getPlayers(), currentUserId);

  const opponentPlayer = categorisedPlayers.getOpponent();
  const currentPlayer = categorisedPlayers.getCurrentPlayer();
  const opponentRows = game.getPlayerRows(opponentPlayer.getUserId());
  const currentPlayerRows = game.getPlayerRows(currentPlayer.getUserId());

  console.log({ currentPlayerRows });
  console.log({ opponentRows });
  return (
    <div className={styles.gameView}>
      <UserGame
        player={opponentPlayer}
        playerRows={opponentRows}
        isCurrentPlayer={currentUserId == game.getPlayers()[0].getUserId()}
      />
      <Separator />
      <UserGame
        player={currentPlayer}
        playerRows={currentPlayerRows}
        isCurrentPlayer={currentUserId == game.getPlayers()[1].getUserId()}
      />
      <PlayerHand hand={currentPlayer.getDeck().getHand()} gameId={gameId} rowType="MELEE" />
    </div>
  );
};

const categorisePlayer = (players: Player[], currentPlayerId: string): CategorisedPlayers =>
  new CategorisedPlayers(players, currentPlayerId);

export default GameView;
