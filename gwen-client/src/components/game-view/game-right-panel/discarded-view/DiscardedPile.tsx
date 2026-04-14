import { type PlayableCard, UnitCard } from 'gwen-common';

export type DiscardedPileProps = {
  discarded: PlayableCard[];
};

const DiscardedPile = ({ discarded }: DiscardedPileProps) => {
  return <div>discarded : {discarded.length}</div>;
};

export default DiscardedPile;
