import type { Card } from 'gwen-common';
import { LeaderCard, NeutralCard, UnitCard } from 'gwen-common';
import LeaderCardView from './LeaderCardView';
import UnitCardView from './UnitCardView';
import NeutralCardView from './NeutralCardView';

type CardViewProps = {
  card: Card;
};

export default function CardView({ card }: CardViewProps) {
  if (card instanceof LeaderCard) return <LeaderCardView card={card} />;
  if (card instanceof NeutralCard) return <NeutralCardView card={card} />;
  if (card instanceof UnitCard) return <UnitCardView card={card} />;
  return null;
}
