import type { PlayableCard } from 'gwen-common';
import CardListViewer from '../../../reusable/card-list-viewer/CardListViewer';
import EmptyDeckSlot from '../../../reusable/empty-deck-slot/EmptyDeckSlot';
import { useDisclosure } from '../../../../hooks/useDisclosure';
import styles from './DiscardedPile.module.scss';

export type DiscardedPileProps = {
  discarded: PlayableCard[];
};

const DiscardedPile = ({ discarded }: DiscardedPileProps) => {
  const { isOpen, open, close } = useDisclosure(false);
  const isEmpty = discarded.length === 0;

  return (
    <>
      {isEmpty ? (
        <EmptyDeckSlot title="Discarded pile is empty" />
      ) : (
        <div className={styles.container} onClick={open}>
          discarded: {discarded.length}
        </div>
      )}
      <CardListViewer isOpen={isOpen} cards={discarded} onClose={close} title="Discard pile" />
    </>
  );
};

export default DiscardedPile;
