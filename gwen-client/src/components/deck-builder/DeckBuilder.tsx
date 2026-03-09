import { useState } from 'react';
import { Datapack, THE_WITCHER_DATAPACK } from 'gwen-common';
import CardCollection from './card-collection/CardCollection';
import FactionLeaderSelector from './FactionLeaderSelector';
import FactionSelector from './FactionSelector';

const DeckBuilder = () => {
  const datapack = new Datapack(THE_WITCHER_DATAPACK);
  const factions = datapack.getFactions();

  const [selectedFactionIndex, setSelectedFactionIndex] = useState(0);
  const faction = factions[selectedFactionIndex];

  return (
    <div>
      <FactionSelector
        factions={factions}
        selectedIndex={selectedFactionIndex}
        onIndexChange={setSelectedFactionIndex}
      />
      <div>
        Faction cards
        <CardCollection faction={faction} />
      </div>
      <div>
        <FactionLeaderSelector />
      </div>
      <div>
        Cards in deck
        <CardCollection faction={faction} />
      </div>
    </div>
  );
};

export default DeckBuilder;
