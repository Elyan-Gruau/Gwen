import type { PlayableCard } from 'gwen-common';
import CardListViewer from '../../../reusable/card-list-viewer/CardListViewer';
import EmptyDeckSlot from '../../../reusable/empty-deck-slot/EmptyDeckSlot';
import { useDisclosure } from '../../../../hooks/useDisclosure';
import styles from './DrawPile.module.scss';

export type DeckpileProps = {
  drawPile: PlayableCard[];
};

const DrawPile = ({ drawPile }: DeckpileProps) => {
  const { isOpen, open, close } = useDisclosure(false);
  const isEmpty = drawPile.length === 0;

  return (
    <>
      {isEmpty ? (
        <EmptyDeckSlot title="Draw pile is empty" />
      ) : (
        <div className={styles.container} onClick={open}>
          drawpile: {drawPile.length}
        </div>
      )}
      <CardListViewer isOpen={isOpen} cards={drawPile} onClose={close} title="Draw pile" />
    </>
  );
};

export default DrawPile;
