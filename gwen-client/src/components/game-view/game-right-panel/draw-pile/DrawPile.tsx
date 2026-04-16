import type { PlayableCard } from 'gwen-common';
import CardListViewer from '../../../reusable/card-list-viewer/CardListViewer';
import EmptyDeckSlot from '../../../reusable/empty-deck-slot/EmptyDeckSlot';
import DeckPile from '../../../reusable/deck-pile/DeckPile';
import { useDisclosure } from '../../../../hooks/useDisclosure';

export type DeckPileProps = {
  drawPile: PlayableCard[];
  factionId: string;
};

const DrawPile = ({ drawPile, factionId }: DeckPileProps) => {
  const { isOpen, open, close } = useDisclosure(false);
  const isEmpty = drawPile.length === 0;

  return (
    <>
      {isEmpty ? (
        <EmptyDeckSlot title="Draw pile is empty" />
      ) : (
        <DeckPile factionId={factionId} count={drawPile.length} onClick={open} />
      )}
      <CardListViewer
        cardSize={'large'}
        isOpen={isOpen}
        cards={drawPile}
        onClose={close}
        title="Draw pile"
      />
    </>
  );
};

export default DrawPile;
