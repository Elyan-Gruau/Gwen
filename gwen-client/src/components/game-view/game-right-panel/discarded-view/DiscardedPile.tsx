import { CharacterCard } from 'gwen-common';

export type DiscardedPileProps = {
  discarded: CharacterCard[];
};

const DiscardedPile = ({ discarded }: DiscardedPileProps) => {
  return <div>discarded : {discarded.length}</div>;
};

export default DiscardedPile;
