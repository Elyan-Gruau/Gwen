import { UnitCard } from 'gwen-common';

export type DiscardedPileProps = {
  discarded: UnitCard[];
};

const DiscardedPile = ({ discarded }: DiscardedPileProps) => {
  return <div>discarded : {discarded.length}</div>;
};

export default DiscardedPile;
