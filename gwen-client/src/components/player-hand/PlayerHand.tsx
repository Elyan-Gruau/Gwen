import { UnitCard } from 'gwen-common';
import UnitCardView from '../card/UnitCardView';

export type PlayerHandProps = {
  hand: UnitCard[];
};

const PlayerHand = ({ hand }: PlayerHandProps) => {
  return (
    <div>
      <h2>Player Hand</h2>
      <ul>
        {hand.map((card, index) => (
          <UnitCardView key={`${card.getName()}-${index}`} card={card} />
        ))}
      </ul>
    </div>
  );
};

export default PlayerHand;
