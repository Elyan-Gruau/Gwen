import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Datapack,
  NeutralCard,
  THE_WITCHER_DATAPACK,
  UnitCard,
  USER_FACTION_DECK_RULES,
  UserFactionDeck,
} from 'gwen-common';

import { useAuthContext } from '../../../contexts/AuthContext';
import CardCollection from '../card-collection/CardCollection';
import FactionLeaderSelector from '../faction-leader-selector/FactionLeaderSelector';
import FactionSelector from '../faction-selector/FactionSelector';
import FavoriteDeckToggle from './FavoriteDeckToggle';
import styles from './DeckBuilder.module.scss';
import { useGetOrCreateUserFactionDeck, useUpdateUserFactionDeck } from 'gwen-generated-api';
import { fromDTOtoModel } from './UserFactionDeckMapper';
import Spinner from '../../spinner/Spinner';

const AUTOSAVE_DELAY_MS = 1000; // 1 second debounce

interface DeckBuilderProps {
  onDeckValidityChange?: (isValid: boolean) => void;
  onDeckIdChange?: (deckId: string) => void;
}

// DeckBuilder component
const DeckBuilder = ({ onDeckValidityChange, onDeckIdChange }: DeckBuilderProps = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { mutate: updateDeck, isPending: isUpdating } = useUpdateUserFactionDeck();
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSavingIndicator, setIsSavingIndicator] = useState(false);
  const [hasUserEditedDeck, setHasUserEditedDeck] = useState(false);

  const datapack = useMemo(() => new Datapack(THE_WITCHER_DATAPACK), []);
  const factions = datapack.getFactions();

  const [selectedFactionIndex, setSelectedFactionIndex] = useState(0);
  const faction = factions[selectedFactionIndex];

  const [userDeck, setUserDeck] = useState<UserFactionDeck>(() => new UserFactionDeck(faction));

  const { data: loadedDeckData, isLoading } = useGetOrCreateUserFactionDeck(
    user?.id || '',
    faction.getId(),
    {
      query: {
        enabled: !!user?.id,
      },
    },
  );

  useEffect(() => {
    if (loadedDeckData && !isLoading) {
      // Chargement depuis l'API → ne pas marquer le deck comme modifié par l'utilisateur
      setUserDeck(fromDTOtoModel(faction, loadedDeckData));
      setHasUserEditedDeck(false);
      // Notify parent of the faction ID (not the deck ID)
      if (onDeckIdChange) {
        onDeckIdChange(faction.getId());
      }
    }
  }, [loadedDeckData, isLoading, faction, onDeckIdChange]);

  const unitCount = userDeck.getNumberOfUnits();
  const specialCount = userDeck.getSpecialCards().length;
  const totalStrength = userDeck.getTotalUnitCardStrength();
  const heroCount = userDeck.getHeroCards().length;
  const isValid = userDeck.isValid();
  const rowDist = userDeck.getRowDistribution();
  const totalUnitsForBar = unitCount || 1;

  const performAutosave = useCallback(() => {
    if (!user || !userDeck) {
      return;
    }

    const unitCardIds = userDeck.getUnitCards().map((c) => c.getId());
    const leaderCardId = userDeck.getLeader()?.getId() || null;
    const specialCardIds = userDeck.getSpecialCards().map((c) => c.getId());

    console.log('Autosaving deck:', {
      unitCardIds,
      leaderCardId,
      specialCardIds,
      firstUnitId: unitCardIds[0],
      totalUnits: unitCardIds.length,
    });

    setIsSavingIndicator(true);
    updateDeck({
      userId: user.id,
      factionId: faction.getId(),
      data: {
        unitCardIds,
        leaderCardId,
        specialCardIds,
      },
    });
    // Reset indicator after a short delay
    setTimeout(() => {
      setIsSavingIndicator(false);
    }, 500);
  }, [user, userDeck, faction, updateDeck]);

  // Debounced autosave effect
  useEffect(() => {
    if (!user?.id || !hasUserEditedDeck) return;

    // Clear existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Set new timer for autosave
    autosaveTimerRef.current = setTimeout(() => {
      performAutosave();
      setHasUserEditedDeck(false);
    }, AUTOSAVE_DELAY_MS);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [userDeck, hasUserEditedDeck, performAutosave, user?.id]);

  // Notify parent component when deck validity changes
  useEffect(() => {
    if (onDeckValidityChange) {
      const isValid =
        userDeck.getLeader() !== null &&
        userDeck.getUnitCards().length >= 25 &&
        userDeck.getSpecialCards().length <= 10;
      onDeckValidityChange(isValid);
    }
  }, [userDeck, onDeckValidityChange]);

  const handleFactionChange = (index: number) => {
    setSelectedFactionIndex(index);
    setHasUserEditedDeck(false);
    // Invalidate the previous faction's deck query to force a fresh fetch
    // This ensures the new faction's deck data is fetched immediately
    void queryClient.invalidateQueries({
      queryKey: ['getOrCreateUserFactionDeck'],
    });
    // Reset to a new empty deck for the faction (temporary until data loads)
    setUserDeck(new UserFactionDeck(factions[index]));
  };

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
    const next = new UserFactionDeck(faction);
    userDeck.getUnitCards().forEach((c) => next.addUnitCard(c));
    userDeck.getSpecialCards().forEach((c) => next.addSpecialCard(c));
    if (userDeck.getLeader()) next.setLeader(userDeck.getLeader()!);
    if (card instanceof NeutralCard) {
      next.addSpecialCard(card);
    } else {
      next.addUnitCard(card);
    }
    setUserDeck(next);
    setHasUserEditedDeck(true);
  };

  const handleRemoveCard = (card: UnitCard | NeutralCard) => {
    const next = new UserFactionDeck(faction);
    userDeck.getUnitCards().forEach((c) => next.addUnitCard(c));
    userDeck.getSpecialCards().forEach((c) => next.addSpecialCard(c));
    if (userDeck.getLeader()) next.setLeader(userDeck.getLeader()!);
    if (card instanceof NeutralCard) {
      next.removeSpecialCard(card.getId());
    } else {
      next.removeUnitCard(card.getId());
    }
    setUserDeck(next);
    setHasUserEditedDeck(true);
  };

  return (
    <div className={styles.deckBuilder}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <Spinner />
        </div>
      )}

      <FactionSelector
        factions={factions}
        selectedIndex={selectedFactionIndex}
        onIndexChange={handleFactionChange}
      />
      <div className={styles.column}>
        <CardCollection faction={faction} cards={availableCards} onCardClick={handleAddCard} />
        {/* ── Centre : leader + stats ── */}
        <div className={styles.centerColumn}>
          <FactionLeaderSelector
            leaders={faction.getLeaders()}
            selectedLeader={userDeck.getLeader()}
            onLeaderSelect={(leader) => {
              const next = new UserFactionDeck(faction);
              userDeck.getUnitCards().forEach((c) => next.addUnitCard(c));
              userDeck.getSpecialCards().forEach((c) => next.addSpecialCard(c));
              next.setLeader(leader);
              setUserDeck(next);
              setHasUserEditedDeck(true);
            }}
          />

          <div className={styles.deckStats}>
            <div className={styles.statRow}>
              <span>Units</span>
              <span className={styles.statValue}>
                {unitCount} / {USER_FACTION_DECK_RULES.MIN_UNIT_CARDS} min
              </span>
            </div>
            <div className={styles.statRow}>
              <span>Specials</span>
              <span className={styles.statValue}>
                {specialCount} / {USER_FACTION_DECK_RULES.MAX_SPECIAL_CARDS} max
              </span>
            </div>
            <div className={styles.statRow}>
              <span>Heros</span>
              <span className={styles.statValue}>{heroCount}</span>
            </div>
            <div className={styles.statRow}>
              <span>Total strength</span>
              <span className={styles.statValue}>{totalStrength}</span>
            </div>
            <div className={styles.statRow}>
              <span>Total cards</span>
              <span className={styles.statValue}>{userDeck.getTotalCards()}</span>
            </div>
            <div className={styles.rowDistribution}>
              <span className={styles.distTitle}>Row distribution</span>
              {[
                { label: 'Melee', count: rowDist.melee, color: '#e85d04' },
                { label: 'Ranged', count: rowDist.ranged, color: '#4cc9f0' },
                { label: 'Siege', count: rowDist.siege, color: '#7209b7' },
                ...(rowDist.agile > 0
                  ? [{ label: 'Agile', count: rowDist.agile, color: '#2ea84a' }]
                  : []),
              ].map(({ label, count, color }) => (
                <div key={label} className={styles.distRow}>
                  <span className={styles.distLabel}>{label}</span>
                  <div className={styles.distBarWrapper}>
                    <div
                      className={styles.distBar}
                      style={{
                        width: `${(count / totalUnitsForBar) * 100}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className={styles.distCount}>{count}</span>
                </div>
              ))}
            </div>
            <FavoriteDeckToggle userId={user?.id} factionId={faction.getId()} />
            <span
              className={`${styles.validBadge} ${isValid ? styles.validBadgeOk : styles.validBadgeKo}`}
            >
              {isValid ? 'Valid deck' : 'Invalid deck'}
            </span>
            <span
              className={`${styles.autoSaveStatus} ${isSavingIndicator || isUpdating ? styles.saving : styles.saved}`}
            >
              {isSavingIndicator || isUpdating ? 'Saving...' : 'Saved'}
            </span>
          </div>
        </div>

        {/* ── Droite : cartes du deck joueur ── */}
        <div className={styles.column}>
          <span className={styles.columnTitle}>Mon deck</span>
          <CardCollection faction={faction} cards={deckCards} onCardClick={handleRemoveCard} />
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
