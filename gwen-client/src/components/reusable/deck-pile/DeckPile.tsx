import styles from './DeckPile.module.scss';
import CardView from '../../card/CardView';

type DeckPileProps = {
  count: number;
  factionId?: string;
  onClick?: () => void;
  visibleSide?: 'front' | 'back';
  cards?: any[];
};

const DeckPile = ({ count, factionId, onClick, visibleSide = 'back', cards }: DeckPileProps) => {
  const backImageUrl = `/data-packs/the-witcher/back/${factionId}_back.jpg`;

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.cardStack}>
        {visibleSide === 'front' && cards && cards.length > 0
          ? cards.slice(0, 3).map((card, index) => (
              <div
                key={card.getId?.() ?? index}
                className={styles.card}
                style={{ transform: `translateY(${index * 4}px)` }}
              >
                <CardView card={card} />
              </div>
            ))
          : [0, 1, 2].map((index) => (
              <div
                key={index}
                className={styles.card}
                style={{ transform: `translateY(${index * 4}px)` }}
              >
                <img src={backImageUrl} alt="Card back" />
              </div>
            ))}
      </div>
      <div className={styles.count}>{count}</div>
    </div>
  );
};

export default DeckPile;
