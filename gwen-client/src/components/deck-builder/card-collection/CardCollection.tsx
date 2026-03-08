import { UnitCard } from 'gwen-common';
import UnitCardView from '../../card/UnitCardView';
import styles from './CardCollection.module.scss';

export type CardCollectionProps = {
  cards: UnitCard[];
};

const CardCollection = ({ cards }: CardCollectionProps) => {
  return (
    <div className="card-collection">
      <h2>Card Collection</h2>
      <div>filters : All, melee, ranged, siege, hero, weather, WTF is this last category ?</div>
      <div className={styles.cardsContainer}>
        {cards.map((c) => {
          return <UnitCardView card={c} />;
        })}
      </div>
      {/* Placeholder for card collection content */}
    </div>
  );
};

export default CardCollection;
