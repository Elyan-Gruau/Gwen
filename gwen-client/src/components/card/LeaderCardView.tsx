import type { LeaderCard } from 'gwen-common';

type LeaderCardViewProps = {
  card: LeaderCard;
};

export default function LeaderCardView({ card }: LeaderCardViewProps) {
  return (
    <img
      src={card.getImageUrl()}
      alt={card.getName()}
      title={card.getName()}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}
