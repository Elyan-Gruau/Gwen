import { NeutralCard, UnitCard } from 'gwen-common';
import UnitCardView from './UnitCardView';
import NeutralCardView from './NeutralCardView';
import { CARD_SIZE } from './CardView';
import type { CardSize } from './CardContainer';

type PlayableCardViewProps = {
  card: UnitCard | NeutralCard;
  size?: CardSize;
};

const PlayableCardView = ({ card, size }: PlayableCardViewProps) => {
  if (card instanceof NeutralCard) {
    return <NeutralCardView card={card} size={size ?? CARD_SIZE} />;
  }
  return <UnitCardView card={card} size={size ?? CARD_SIZE} />;
};

export default PlayableCardView;
