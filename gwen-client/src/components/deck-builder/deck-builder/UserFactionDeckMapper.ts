import type { DTOUserFactionDeck } from 'gwen-generated-api';
import type { Faction, UserFactionDeck } from 'gwen-common';
import {
  UserFactionDeck as UserFactionDeckClass,
  UnitCard as UnitCardClass,
  NeutralCard as NeutralCardClass,
} from 'gwen-common';

/**
 * Converts a DTOUserFactionDeck into a UserFactionDeck model instance.
 */
export const fromDTOtoModel = (
  faction: Faction,
  loadedDeckData: DTOUserFactionDeck,
): UserFactionDeck => {
  console.info('Loading user deck from DTO:', loadedDeckData);
  const newDeck = new UserFactionDeckClass(faction);
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
        if (card instanceof UnitCardClass) {
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
        if (card instanceof NeutralCardClass) {
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
