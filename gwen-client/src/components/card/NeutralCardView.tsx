import type { NeutralCard } from 'gwen-common';
import CardContainer from './CardContainer';
import styles from './NeutralCardView.module.scss';

type NeutralCardViewProps = {
  card: NeutralCard;
};

const TYPE_LABELS: Record<string, string> = {
  BITING_FROST: 'Biting Frost',
  TORRENTIAL_RAIN: 'Torrential Rain',
  IMPENETRABLE_FOG: 'Impenetrable Fog',
  CLEAR_WEATHER: 'Clear Weather',
  SCORCH: 'Scorch',
  COMMANDER_HORN: "Commander's Horn",
  DECOY: 'Decoy',
};

export default function NeutralCardView({ card }: NeutralCardViewProps) {
  return (
    <CardContainer>
      <div className={styles.wrapper}>
        <img
          className={styles.image}
          src={`/data-packs/the-witcher${card.getImageUrl()}`}
          alt={card.getName()}
          title={card.getName()}
        />
        <div className={styles.typeBadge}>
          <span className={styles.typeLabel}>{TYPE_LABELS[card.getType()] ?? card.getType()}</span>
        </div>
      </div>
    </CardContainer>
  );
}
