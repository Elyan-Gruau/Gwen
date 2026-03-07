import { CharacterCard } from 'gwen-common';
import CharacterCardView from '../card/CharacterCardView';

export type PlayerHandProps = {
  hand: CharacterCard[];
};

const PlayerHand = ({ hand }: PlayerHandProps) => {
  return (
    <div>
      <h2>Player Hand</h2>
      <ul>
        {hand.map((card, index) => (
          <CharacterCardView key={`${card.getName()}-${index}`} card={card} />
        ))}
      </ul>
    </div>
  );
};

export default PlayerHand;
