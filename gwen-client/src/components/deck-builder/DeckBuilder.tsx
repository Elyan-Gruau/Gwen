import { Datapack, THE_WITCHER_DATAPACK } from 'gwen-common';
import CardCollection from './card-collection/CardCollection';
import FactionLeaderSelector from './FactionLeaderSelector';

const DeckBuilder = () => {
  const dumyDatapack = new Datapack(THE_WITCHER_DATAPACK);
  return (
    <div>
      Faction selector
      <div>
        Faction cards
        <CardCollection cards={dumyDatapack.getFactions()[0].getUnits()} />
      </div>
      <div>
        <FactionLeaderSelector />
      </div>
      <div>
        Cards in deck
        <CardCollection cards={dumyDatapack.getFactions()[0].getUnits()} />
      </div>
    </div>
  );
};

export default DeckBuilder;
