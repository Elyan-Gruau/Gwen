import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Datapack,
  Faction,
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
import styles from './DeckBuilder.module.scss';
import {
  type DTOUserFactionDeck,
  useGetOrCreateUserFactionDeck,
  useUpdateUserFactionDeck,
} from 'gwen-generated-api';

const AUTOSAVE_DELAY_MS = 1000; // 1 second debounce

const DeckBuilder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { mutate: updateDeck, isPending: isUpdating } = useUpdateUserFactionDeck();
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSavingIndicator, setIsSavingIndicator] = useState(false);

  const datapack = useMemo(() => new Datapack(THE_WITCHER_DATAPACK), []);
  const factions = datapack.getFactions();

  const [selectedFactionIndex, setSelectedFactionIndex] = useState(0);
  const faction = factions[selectedFactionIndex];

  const [userDeck, setUserDeck] = useState<UserFactionDeck>(() => new UserFactionDeck(faction));

  const { data: loadedDeckData, isLoading } = useGetOrCreateUserFactionDeck(
    user?.id || '',
    faction.getName(),
    {
      query: {
        enabled: !!user?.id,
      },
    },
  );

  useEffect(() => {
    if (loadedDeckData && !isLoading) {
      setUserDeck(fromDTOtoModel(faction, loadedDeckData));
    }
  }, [loadedDeckData, isLoading, faction]);

  const unitCount = userDeck.getNumberOfUnits();
  const specialCount = userDeck.getSpecialCards().length;
  const totalStrength = userDeck.getTotalUnitCardStrength();
  const heroCount = userDeck.getHeroCards().length;
  const isValid = userDeck.isValid();

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
      factionId: faction.getName(),
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
    if (!user?.id) return;

    // Clear existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Set new timer for autosave
    autosaveTimerRef.current = setTimeout(() => {
      performAutosave();
    }, AUTOSAVE_DELAY_MS);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [userDeck, performAutosave, user?.id]);

  const handleFactionChange = (index: number) => {
    setSelectedFactionIndex(index);
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
  };

  return (
    <div className={styles.deckBuilder}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <p>Loading deck...</p>
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

const fromDTOtoModel = (faction: Faction, loadedDeckData: DTOUserFactionDeck): UserFactionDeck => {
  console.info('Loading user deck from DTO:', loadedDeckData);
  const newDeck = new UserFactionDeck(faction);
  const playableCards = faction.getPlayableCards();
  console.log(`Available cards in faction: ${playableCards.length}`);

  // Log first few cards to see their IDs
  console.log(
    'Sample card IDs in faction:',
    playableCards.slice(0, 3).map((c) => ({ id: c.getId(), name: (c as any).name || 'unknown' })),
  );

  // Load units
  if (loadedDeckData.unit_card_ids && Array.isArray(loadedDeckData.unit_card_ids)) {
    console.log(`Loading ${loadedDeckData.unit_card_ids.length} unit card IDs`);
    console.log('First saved unit ID:', loadedDeckData.unit_card_ids[0]);
    loadedDeckData.unit_card_ids.forEach((cardId) => {
      const card = playableCards.find((c) => c.getId() === cardId);
      if (card) {
        if (card instanceof UnitCard) {
          newDeck.addUnitCard(card);
          console.log(`Added unit card: ${cardId}`);
        } else {
          console.warn(`Card ${cardId} found but is not a UnitCard:`, card);
        }
      } else {
        console.warn(`Card not found: ${cardId}`);
      }
    });
  }

  // Load special cards
  if (loadedDeckData.special_card_ids && Array.isArray(loadedDeckData.special_card_ids)) {
    console.log(`Loading ${loadedDeckData.special_card_ids.length} special card IDs`);
    loadedDeckData.special_card_ids.forEach((cardId) => {
      const card = playableCards.find((c) => c.getId() === cardId);
      if (card) {
        if (card instanceof NeutralCard) {
          newDeck.addSpecialCard(card);
          console.log(`Added special card: ${cardId}`);
        } else {
          console.warn(`Card ${cardId} found but is not a NeutralCard:`, card);
        }
      } else {
        console.warn(`Special card not found: ${cardId}`);
      }
    });
  }

  // Load leader
  if (loadedDeckData.leader_card_id) {
    const leader = faction.getLeaders().find((l) => l.getId() === loadedDeckData.leader_card_id);
    if (leader) {
      newDeck.setLeader(leader);
      console.log(`Added leader: ${loadedDeckData.leader_card_id}`);
    } else {
      console.warn(`Leader not found: ${loadedDeckData.leader_card_id}`);
    }
  }

  console.log(
    'Final loaded deck:',
    newDeck.getUnitCards().length,
    'units,',
    newDeck.getSpecialCards().length,
    'specials',
  );
  return newDeck;
};

export default DeckBuilder;
