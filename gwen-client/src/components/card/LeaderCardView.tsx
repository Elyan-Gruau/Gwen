import type { LeaderCard } from 'gwen-common';
import CardContainer, { type CardSize } from './CardContainer';
import styles from './LeaderCardView.module.scss';

type LeaderCardViewProps = {
  card: LeaderCard;
  size?: CardSize;
};

const LeaderCardView = ({ card, size }: LeaderCardViewProps) => {
  return (
    <CardContainer size={size}>
      <img
        className={styles.image}
        src={`/data-packs/the-witcher${card.getImageUrl()}`}
        alt={card.getName()}
        title={card.getName()}
      />
    </CardContainer>
  );
};

export default LeaderCardView;
