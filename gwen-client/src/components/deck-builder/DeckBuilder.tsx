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
    // Copy existing cards
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
    <div>
      <FactionSelector
        factions={factions}
        selectedIndex={selectedFactionIndex}
        onIndexChange={setSelectedFactionIndex}
      />
      <div>
        Faction cards
        <CardCollection faction={faction} cards={availableCards} onCardClick={handleAddCard} />
      </div>
      <div>
        <FactionLeaderSelector />
      </div>
      <div>
        <div>
          <span>Cards in deck — </span>
          <span>
            Units: {unitCount}/{USER_FACTION_DECK_RULES.MIN_UNIT_CARDS} min
          </span>
          {' | '}
          <span>
            Specials: {specialCount}/{USER_FACTION_DECK_RULES.MAX_SPECIAL_CARDS} max
          </span>
          {' | '}
          <span>Heroes: {heroCount}</span>
          {' | '}
          <span>Total strength: {totalStrength}</span>
          {' | '}
          <span>Total: {userDeck.getTotalCards()}</span>
          {' | '}
          <span style={{ color: isValid ? 'green' : 'red' }}>
            {isValid ? '✓ Valid' : '✗ Invalid'}
          </span>
        </div>
        <CardCollection faction={faction} cards={deckCards} onCardClick={handleRemoveCard} />
      </div>
    </div>
  );
};

export default DeckBuilder;
