import type { DatapackConfig } from '../types/game/DatapackConfig';

/**
 * Validates that all card IDs are unique and throws an error if duplicates are found
 */
export const validateAllCardIds = (config: DatapackConfig): void => {
  const allCards: Array<{ id: string; name: string }> = [];

  // Collect all leader cards
  for (const faction of config.factions) {
    allCards.push(...faction.leaders);
  }

  // Collect all faction unit cards
  for (const faction of config.factions) {
    allCards.push(...faction.units);
  }

  // Collect all neutral unit cards
  allCards.push(...config.neutralUnits);

  // Collect all neutral spell/ability cards
  for (const neutral of config.neutrals) {
    allCards.push(neutral);
  }

  validateUniqueCardIds(allCards);
};

const validateUniqueCardIds = (cards: Array<{ id: string; name: string }>): void => {
  const seenIds = new Map<string, string[]>();

  for (const card of cards) {
    if (!seenIds.has(card.id)) {
      seenIds.set(card.id, []);
    }
    seenIds.get(card.id)!.push(card.name);
  }

  const duplicates = Array.from(seenIds.entries()).filter(([, names]) => names.length > 1);

  if (duplicates.length > 0) {
    const duplicateMessages = duplicates
      .map(([id, names]) => `  - ID "${id}": ${names.join(', ')}`)
      .join('\n');
    throw new Error(
      `Duplicate card IDs found in datapack:\n${duplicateMessages}\n\nEach card must have a unique ID. Consider renaming cards or adding suffixes.`,
    );
  }
};
