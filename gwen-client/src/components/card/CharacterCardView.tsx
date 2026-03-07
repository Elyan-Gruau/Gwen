import type { CharacterCard } from 'gwen-common';

type CharacterCardViewProps = {
  card: CharacterCard;
};

export default function CharacterCardView({ card }: CharacterCardViewProps) {
  return (
    <img
      src={card.getImageUrl()}
      alt={card.getName()}
      title={`${card.getName()} — ${card.getPower()} pts`}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}
