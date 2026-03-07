import { CharacterCard } from 'gwen-common';

export type PlayerHandProps = {
  hand: CharacterCard[];
};

const PlayerHand = ({ hand }: PlayerHandProps) => {
  return (
    <div>
      <h2>Player Hand</h2>
      <ul>
        {hand.map((card, index) => (
          <li key={index}>{card.getName()}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerHand;
