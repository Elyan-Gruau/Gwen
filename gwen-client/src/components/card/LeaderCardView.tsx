import type { LeaderCard } from 'gwen-common';
import CardContainer from './CardContainer';

type LeaderCardViewProps = {
  card: LeaderCard;
};

const LeaderCardView = ({ card }: LeaderCardViewProps) => {
  return (
    <CardContainer>
      <img
        src={card.getImageUrl()}
        alt={card.getName()}
        title={card.getName()}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </CardContainer>
  );
};

export default LeaderCardView;
