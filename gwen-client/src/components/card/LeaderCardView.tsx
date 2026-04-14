import type { LeaderCard } from 'gwen-common';
import CardContainer from './CardContainer';
import styles from './LeaderCardView.module.scss';

type LeaderCardViewProps = {
  card: LeaderCard;
};

const LeaderCardView = ({ card }: LeaderCardViewProps) => {
  return (
    <CardContainer>
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
