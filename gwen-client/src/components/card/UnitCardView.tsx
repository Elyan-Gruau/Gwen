import type { UnitCard } from 'gwen-common';
import CardContainer from './CardContainer';
import type { CardSize } from './CardContainer';
import styles from './UnitCardView.module.scss';

export type UnitCardViewProps = {
  card: UnitCard;
  onClick?: (card: UnitCard) => void;
  size?: CardSize;
};

const ABILITY_LABELS: Record<string, string> = {
  AGILE: 'Agile',
  MEDIC: 'Medic',
  MORAL_BOOST: 'Moral Boost',
  MUSTER: 'Muster',
  SPY: 'Spy',
  TIGHT_BOND: 'Tight Bond',
  ROW_BOOST: 'Row Boost',
  DECAY: 'Decay',
  COMMANDER_HORN: 'Commander Horn',
};

const RANGE_LABELS: Record<string, string> = {
  MELEE: 'Melee',
  RANGED: 'Ranged',
  SIEGE: 'Siege',
  AGILE: 'Agile',
};

export default function UnitCardView({ card, onClick, size = 'medium' }: UnitCardViewProps) {
  const isHero = card.getIsHero();
  const ability = card.getAbility();
  const ranges = card.getRanges();

  const handleCardClicked = () => {
    onClick?.(card);
  };

  return (
    <CardContainer size={size}>
      <div className={`${styles.wrapper} ${isHero ? styles.hero : ''}`} onClick={handleCardClicked}>
        {/* Image */}
        <img
          draggable={false}
          className={styles.image}
          src={`/data-packs/the-witcher${card.getImageUrl()}`}
          alt={card.getName()}
        />

        {/* Hero border */}
        {isHero && <div className={styles.heroBorder} />}

        {/* Strength badge */}
        <div className={styles.strength}>{card.getStrength()}</div>

        {/* Footer: ability + ranges */}
        <div className={styles.footer}>
          {ability && <span className={styles.ability}>{ABILITY_LABELS[ability] ?? ability}</span>}
          <div className={styles.ranges}>
            {ranges.map((r: string) => (
              <span key={r} className={styles.range}>
                {RANGE_LABELS[r] ?? r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CardContainer>
  );
}
