import { Datapack, THE_WITCHER_DATAPACK } from 'gwen-common';
import CardCollection from './card-collection/CardCollection';
import FactionLeaderSelector from './FactionLeaderSelector';

const DeckBuilder = () => {
  const dumyDatapack = new Datapack(THE_WITCHER_DATAPACK);
  const faction = dumyDatapack.getFactions()[0];
  return (
    <div>
      Faction selector
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
