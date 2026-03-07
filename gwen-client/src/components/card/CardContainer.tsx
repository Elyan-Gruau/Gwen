import { type Card, CharacterCard, LeaderCard } from 'gwen-common';
import styles from './CardContainer.module.scss';
import CharacterCardView from './CharacterCardView';
import LeaderCardView from './LeaderCardView';

type CardContainerProps = {
  card: Card;
};

export default function CardContainer({ card }: CardContainerProps) {
  return (
    <div className={styles.cardContainer}>
      {card instanceof LeaderCard ? (
        <LeaderCardView card={card} />
      ) : card instanceof CharacterCard ? (
        <CharacterCardView card={card} />
      ) : null}
    </div>
  );
}
