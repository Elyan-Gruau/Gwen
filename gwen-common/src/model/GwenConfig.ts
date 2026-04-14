import { Datapack } from './Datapack';
import { THE_WITCHER_DATAPACK } from '../datapacks';
import { DatapackCardIndex } from './DatapackCardIndex';

const currentDatapack = new Datapack(THE_WITCHER_DATAPACK);
const currentDatapackCardIndex = new DatapackCardIndex(currentDatapack.getFactions());

export abstract class GwenConfig {
  static getCurrentDatapack(): Datapack {
    return currentDatapack;
  }

  static getCurrentDatapackCardIndex(): DatapackCardIndex {
    return currentDatapackCardIndex;
  }
}
