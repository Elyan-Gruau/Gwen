import styles from './DeckPile.module.scss';

type DeckPileProps = {
  count: number;
  factionId?: string;
  onClick?: () => void;
};

const DeckPile = ({ count, factionId, onClick }: DeckPileProps) => {
  const backImageUrl = `/data-packs/the-witcher/back/${factionId}_back.jpg`;

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.cardStack}>
        {[0, 1, 2].map((index) => (
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
