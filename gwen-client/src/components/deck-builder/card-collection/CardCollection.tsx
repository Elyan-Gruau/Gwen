import { CharacterCard } from 'gwen-common';
import CharacterCardView from '../../card/CharacterCardView';
import styles from './CardCollection.module.scss';

export type CardCollectionProps = {
  cards: CharacterCard[];
};

const CardCollection = ({ cards }: CardCollectionProps) => {
  return (
    <div className="card-collection">
      <h2>Card Collection</h2>
      <div>filters : All, melee, ranged, siege, hero, weather, WTF is this last category ?</div>
      <div className={styles.cardsContainer}>
        {cards.map((c) => {
          return <CharacterCardView card={c} />;
        })}
      </div>
      {/* Placeholder for card collection content */}
    </div>
  );
};

export default CardCollection;
