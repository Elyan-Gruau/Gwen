import type { Card } from 'gwen-common';
import { LeaderCard, NeutralCard, UnitCard } from 'gwen-common';
import LeaderCardView from './LeaderCardView';
import UnitCardView from './UnitCardView';
import NeutralCardView from './NeutralCardView';
import type { CardSize } from './CardContainer';

export const CARD_SIZE: CardSize = 'small';

type CardViewProps = {
  card: Card;
  size?: CardSize;
};

const CardView = ({ card, size }: CardViewProps) => {
  const finalSize = size ?? CARD_SIZE;
  if (card instanceof LeaderCard) return <LeaderCardView card={card} size={finalSize} />;
  if (card instanceof NeutralCard) return <NeutralCardView card={card} size={finalSize} />;
  if (card instanceof UnitCard) return <UnitCardView card={card} size={finalSize} />;
  return null;
};

export default CardView;
