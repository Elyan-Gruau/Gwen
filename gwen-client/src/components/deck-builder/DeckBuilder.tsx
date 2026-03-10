import { useMemo, useState } from 'react';
import {
  Datapack,
  NeutralCard,
  THE_WITCHER_DATAPACK,
  UnitCard,
  USER_FACTION_DECK_RULES,
  UserFactionDeck,
} from 'gwen-common';
import CardCollection from './card-collection/CardCollection';
import FactionLeaderSelector from './FactionLeaderSelector';
import FactionSelector from './FactionSelector';
import styles from './DeckBuilder.module.scss';

const DeckBuilder = () => {
  const datapack = useMemo(() => new Datapack(THE_WITCHER_DATAPACK), []);
  const factions = datapack.getFactions();

  const [selectedFactionIndex, setSelectedFactionIndex] = useState(0);
  const faction = factions[selectedFactionIndex];

  const [userDeck, setUserDeck] = useState<UserFactionDeck>(() => new UserFactionDeck());

  const selectedCardIds = useMemo(() => {
    const ids = new Set<string>();
    userDeck.getUnitCards().forEach((c) => ids.add(c.getId()));
    userDeck.getSpecialCards().forEach((c) => ids.add(c.getId()));
    return ids;
  }, [userDeck]);

  const deckCards: (UnitCard | NeutralCard)[] = useMemo(
    () => [...userDeck.getUnitCards(), ...userDeck.getSpecialCards()],
    [userDeck],
  );

  const availableCards: (UnitCard | NeutralCard)[] = useMemo(
    () => faction.getPlayableCards().filter((c) => !selectedCardIds.has(c.getId())),
    [faction, selectedCardIds],
  );

  const handleAddCard = (card: UnitCard | NeutralCard) => {
    const next = new UserFactionDeck();
    userDeck.getUnitCards().forEach((c) => next.addUnitCard(c));
    userDeck.getSpecialCards().forEach((c) => next.addSpecialCard(c));
    if (userDeck.getLeader()) next.setLeader(userDeck.getLeader()!);
    if (card instanceof NeutralCard) {
      next.addSpecialCard(card);
    } else {
      next.addUnitCard(card);
    }
    setUserDeck(next);
  };

  const handleRemoveCard = (card: UnitCard | NeutralCard) => {
    const next = new UserFactionDeck();
    userDeck.getUnitCards().forEach((c) => next.addUnitCard(c));
    userDeck.getSpecialCards().forEach((c) => next.addSpecialCard(c));
    if (userDeck.getLeader()) next.setLeader(userDeck.getLeader()!);
    if (card instanceof NeutralCard) {
      next.removeSpecialCard(card.getId());
    } else {
      next.removeUnitCard(card.getId());
    }
    setUserDeck(next);
  };

  const unitCount = userDeck.getNumberOfUnits();
  const specialCount = userDeck.getSpecialCards().length;
  const totalStrength = userDeck.getTotalUnitCardStrength();
  const heroCount = userDeck.getHeroCards().length;
  const isValid = userDeck.isValid();

  return (
    <div className={styles.deckBuilder}>
      {/* ── Gauche : collection de la faction ── */}
      <div className={styles.column}>
        <FactionSelector
          factions={factions}
          selectedIndex={selectedFactionIndex}
          onIndexChange={setSelectedFactionIndex}
        />
        <CardCollection faction={faction} cards={availableCards} onCardClick={handleAddCard} />
      </div>

      {/* ── Centre : leader + stats ── */}
      <div className={styles.centerColumn}>
        <FactionLeaderSelector
          leaders={faction.getLeaders()}
          selectedLeader={userDeck.getLeader()}
          onLeaderSelect={(leader) => {
            const next = new UserFactionDeck();
            userDeck.getUnitCards().forEach((c) => next.addUnitCard(c));
            userDeck.getSpecialCards().forEach((c) => next.addSpecialCard(c));
            next.setLeader(leader);
            setUserDeck(next);
          }}
        />

        <div className={styles.deckStats}>
          <div className={styles.statRow}>
            <span>Unités</span>
            <span className={styles.statValue}>
              {unitCount} / {USER_FACTION_DECK_RULES.MIN_UNIT_CARDS} min
            </span>
          </div>
          <div className={styles.statRow}>
            <span>Spéciaux</span>
            <span className={styles.statValue}>
              {specialCount} / {USER_FACTION_DECK_RULES.MAX_SPECIAL_CARDS} max
            </span>
          </div>
          <div className={styles.statRow}>
            <span>Héros</span>
            <span className={styles.statValue}>{heroCount}</span>
          </div>
          <div className={styles.statRow}>
            <span>Force totale</span>
            <span className={styles.statValue}>{totalStrength}</span>
          </div>
          <div className={styles.statRow}>
            <span>Total cartes</span>
            <span className={styles.statValue}>{userDeck.getTotalCards()}</span>
          </div>
          <span
            className={`${styles.validBadge} ${isValid ? styles.validBadgeOk : styles.validBadgeKo}`}
          >
            {isValid ? '✓ Deck valide' : '✗ Deck invalide'}
          </span>
        </div>
      </div>

      {/* ── Droite : cartes du deck joueur ── */}
      <div className={styles.column}>
        <span className={styles.columnTitle}>Mon deck</span>
        <CardCollection faction={faction} cards={deckCards} onCardClick={handleRemoveCard} />
      </div>
    </div>
  );
};

export default DeckBuilder;
