import type { Card } from 'gwen-common';
import { LeaderCard, NeutralCard, UnitCard } from 'gwen-common';
import LeaderCardView from './LeaderCardView';
import UnitCardView from './UnitCardView';
import NeutralCardView from './NeutralCardView';
import type { CardSize } from './CardContainer';

type CardViewProps = {
  card: Card;
  size?: CardSize;
};

export default function CardView({ card, size }: CardViewProps) {
  if (card instanceof LeaderCard) return <LeaderCardView card={card} size={size} />;
  if (card instanceof NeutralCard) return <NeutralCardView card={card} size={size} />;
  if (card instanceof UnitCard) return <UnitCardView card={card} size={size} />;
  return null;
}
