import { NeutralCard, UnitCard } from 'gwen-common';
import UnitCardView from './UnitCardView';
import NeutralCardView from './NeutralCardView';

type PlayableCardViewProps = {
  card: UnitCard | NeutralCard;
};

export default function PlayableCardView({ card }: PlayableCardViewProps) {
  if (card instanceof NeutralCard) {
    return <NeutralCardView card={card} />;
  }
  return <UnitCardView card={card} />;
}
