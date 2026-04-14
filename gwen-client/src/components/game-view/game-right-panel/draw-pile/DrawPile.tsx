import type { PlayableCard } from 'gwen-common';
import CardListViewer from '../../../reusable/card-list-viewer/CardListViewer';
import { useDisclosure } from '../../../../hooks/useDisclosure';

export type DeckpileProps = {
  drawPile: PlayableCard[];
};

const DrawPile = ({ drawPile }: DeckpileProps) => {
  const { isOpen, open, close } = useDisclosure(false);

  return (
    <>
      <div onClick={open}>drawpile: {drawPile.length}</div>
      <CardListViewer isOpen={isOpen} cards={drawPile} onClose={close} title="Draw pile" />
    </>
  );
};

export default DrawPile;
