import { NeutralCard, UnitCard } from 'gwen-common';
import UnitCardView from './UnitCardView';
import NeutralCardView from './NeutralCardView';
import { CARD_SIZE } from './CardView';

type PlayableCardViewProps = {
  card: UnitCard | NeutralCard;
};

const PlayableCardView = ({ card }: PlayableCardViewProps) => {
  if (card instanceof NeutralCard) {
    return <NeutralCardView card={card} size={CARD_SIZE} />;
  }
  return <UnitCardView card={card} size={CARD_SIZE} />;
};

export default PlayableCardView;
