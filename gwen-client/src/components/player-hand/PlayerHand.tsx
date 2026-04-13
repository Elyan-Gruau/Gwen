import { type PlayableCard } from 'gwen-common';
import UnitCardView from '../card/UnitCardView';
import CardView from '../card/CardView';

export type PlayerHandProps = {
  hand: PlayableCard[];
};

const PlayerHand = ({ hand }: PlayerHandProps) => {
  return (
    <div>
      <h2>Player Hand</h2>
      <ul>
        {hand.map((card, index) => (
          <CardView key={`${card.getName()}-${index}`} card={card} />
        ))}
      </ul>
    </div>
  );
};

export default PlayerHand;
