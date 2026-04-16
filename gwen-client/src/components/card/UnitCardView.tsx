import type { UnitCard } from 'gwen-common';
import CardContainer from './CardContainer';
import type { CardSize } from './CardContainer';
import styles from './UnitCardView.module.scss';
import UnitAbilityIcon from './UnitAbilityIcon';

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

const RANGE_ICONS: Record<string, string> = {
  MELEE: '/icons/melee.png',
  RANGED: '/icons/range.png',
  SIEGE: '/icons/siege.png',
  AGILE: '/icons/agile.png',
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

        {/* Range icon (affiche la première range, ou AGILE si plusieurs) */}
        {ranges.length > 0 && (
          <div className={styles.rangeIcon}>
            <img
              src={RANGE_ICONS[ranges.length > 1 ? 'AGILE' : ranges[0]]}
              alt={ranges.length > 1 ? 'Agile' : ranges[0]}
            />
          </div>
        )}

        {/* Ability icon (à gauche de RangeIcon) */}
        {ability && (
          <span className={styles.abilityIcon}>
            <UnitAbilityIcon ability={ability} size="100%" />
          </span>
        )}

        {/* Footer: ability */}
        {/* {ability && <span className={styles.ability}>{ABILITY_LABELS[ability] ?? ability}</span>} */}
      </div>
    </CardContainer>
  );
}
