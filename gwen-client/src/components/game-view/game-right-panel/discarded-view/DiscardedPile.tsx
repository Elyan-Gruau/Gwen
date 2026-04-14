import type { PlayableCard } from 'gwen-common';
import CardListViewer from '../../../reusable/card-list-viewer/CardListViewer';
import { useDisclosure } from '../../../../hooks/useDisclosure';

export type DiscardedPileProps = {
  discarded: PlayableCard[];
};

const DiscardedPile = ({ discarded }: DiscardedPileProps) => {
  const { isOpen, open, close } = useDisclosure(false);

  return (
    <>
      <div onClick={open}>discarded : {discarded.length}</div>
      <CardListViewer isOpen={isOpen} cards={discarded} onClose={close} title="Discard pile" />
    </>
  );
};

export default DiscardedPile;
