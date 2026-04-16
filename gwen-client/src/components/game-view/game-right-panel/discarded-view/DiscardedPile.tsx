import type { PlayableCard } from 'gwen-common';
import CardListViewer from '../../../reusable/card-list-viewer/CardListViewer';
import EmptyDeckSlot from '../../../reusable/empty-deck-slot/EmptyDeckSlot';
import DeckPile from '../../../reusable/deck-pile/DeckPile';
import { useDisclosure } from '../../../../hooks/useDisclosure';

export type DiscardedPileProps = {
  discarded: PlayableCard[];
  factionId: string;
};

const DiscardedPile = ({ discarded, factionId }: DiscardedPileProps) => {
  const { isOpen, open, close } = useDisclosure(false);
  const isEmpty = discarded.length === 0;

  return (
    <>
      {isEmpty ? (
        <EmptyDeckSlot title="Discarded pile is empty" />
      ) : (
        <DeckPile
          factionId={factionId}
          count={discarded.length}
          onClick={open}
          visibleSide="front"
          cards={discarded}
        />
      )}
      <CardListViewer isOpen={isOpen} cards={discarded} onClose={close} title="Discard pile" />
    </>
  );
};

export default DiscardedPile;
