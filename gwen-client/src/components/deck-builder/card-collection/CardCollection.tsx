import { useState } from 'react';
import { Faction, NeutralCard, UnitCard } from 'gwen-common';
import PlayableCardView from '../../card/PlayableCardView';
import styles from './CardCollection.module.scss';

export type CardCollectionProps = {
  faction: Faction;
};

const WEATHER_TYPES = new Set([
  'BITING_FROST',
  'TORRENTIAL_RAIN',
  'IMPENETRABLE_FOG',
  'CLEAR_WEATHER',
]);

type Filter = 'ALL' | 'MELEE' | 'RANGED' | 'SIEGE' | 'HERO' | 'WEATHER' | 'SPECIAL';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'MELEE', label: 'Melee' },
  { key: 'RANGED', label: 'Ranged' },
  { key: 'SIEGE', label: 'Siege' },
  { key: 'HERO', label: 'Hero' },
  { key: 'WEATHER', label: 'Weather' },
  { key: 'SPECIAL', label: 'Neutrals' },
];

const CardCollection = ({ faction }: CardCollectionProps) => {
  const [active, setActive] = useState<Filter>('ALL');

  const allCards = faction.getPlayableCards();

  const filtered = allCards.filter((card) => {
    if (active === 'ALL') return true;

    if (card instanceof NeutralCard) {
      const isWeather = WEATHER_TYPES.has(card.getType());
      if (active === 'WEATHER') return isWeather;
      if (active === 'SPECIAL') return !isWeather;
      return false;
    }

    if (card instanceof UnitCard) {
      if (active === 'HERO') return card.getIsHero();
      if (active === 'MELEE') return card.getRanges().includes('MELEE');
      if (active === 'RANGED') return card.getRanges().includes('RANGED');
      if (active === 'SIEGE') return card.getRanges().includes('SIEGE');
    }

    return false;
  });

  return (
    <div className={styles.cardCollection}>
      <div className={styles.filters}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.filterBtn} ${active === key ? styles.filterBtnActive : ''}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.cardsContainer}>
        {filtered.map((c) => (
          <PlayableCardView key={c.getId()} card={c} />
        ))}
      </div>
    </div>
  );
};

export default CardCollection;
