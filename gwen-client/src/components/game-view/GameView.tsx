import styles from './GameView.module.scss';
import UserGame from './user-game/UserGame';
import { Game, type Player } from 'gwen-common';
import { CategorisedPlayers } from '../../model/CategorisedPlayers';

type GameViewProps = {
  game: Game;
};

const GameView = ({ game }: GameViewProps) => {
  const currentUserId = 'player1';

  const categorisedPlayers = categorisePlayer(game.getPlayers(), currentUserId);

  return (
    <div className={styles.gameView}>
      <UserGame
        player={categorisedPlayers.getOpponent()}
        isCurrentPlayer={currentUserId == game.getPlayers()[0].getUserId()}
      />
      <span>SEPARATOR</span>
      <UserGame
        player={categorisedPlayers.getCurrentPlayer()}
        isCurrentPlayer={currentUserId == game.getPlayers()[1].getUserId()}
      />
    </div>
  );
};

const categorisePlayer = (players: Player[], currentPlayerId: string): CategorisedPlayers =>
  new CategorisedPlayers(players, currentPlayerId);

export default GameView;
