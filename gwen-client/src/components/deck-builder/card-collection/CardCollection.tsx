import PlayableCardView from '../../card/PlayableCardView';
import styles from './CardCollection.module.scss';
import { Faction } from 'gwen-common';

export type CardCollectionProps = {
  faction: Faction;
};

const CardCollection = ({ faction }: CardCollectionProps) => {
  return (
    <div className="card-collection">
      <h2>Card Collection</h2>
      <div>filters : All, melee, ranged, siege, hero, weather, WTF is this last category ?</div>
      <div className={styles.cardsContainer}>
        {faction.getPlayableCards().map((c) => (
          <PlayableCardView key={c.getId()} card={c} />
        ))}
      </div>
    </div>
  );
};

export default CardCollection;
