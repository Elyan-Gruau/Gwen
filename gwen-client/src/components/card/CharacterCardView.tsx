import type { CharacterCard } from 'gwen-common';
import CardContainer from './CardContainer';

type CharacterCardViewProps = {
  card: CharacterCard;
};

export default function CharacterCardView({ card }: CharacterCardViewProps) {
  return (
    <CardContainer>
      <img
        src={`/data-packs/the-witcher${card.getImageUrl()}`}
        alt={card.getName()}
        title={`${card.getName()} — ${card.getStrength()} pts`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </CardContainer>
  );
}
