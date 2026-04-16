import { useEffect, useRef, useState } from 'react';
import type { Card } from 'gwen-common';
import CardCarousel from '../card-carousel/CardCarousel';
import Button from '../button/Button';
import styles from './CardListViewer.module.scss';
import type { CardSize } from '../../card/CardContainer';

export type CardListViewerProps = {
  isOpen: boolean;
  cards: Card[];
  initialIndex?: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onCardConfirm?: (card: Card, index: number) => void;
  cardSize?: CardSize;
};

const VISIBLE_RADIUS = 3; // 7 cards visible at a time (center ±2)

const CardListViewer = ({
  isOpen,
  cards,
  initialIndex,
  title,
  subtitle,
  onClose,
  onCardConfirm,
  cardSize = 'medium',
}: CardListViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || cards.length === 0) {
      return;
    }

    setActiveIndex(initialIndex != null ? initialIndex : 0);

    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [isOpen, cards.length, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || cards.length === 0) {
    return null;
  }

  const items = cards.map((card) => ({
    id: card.getId(),
    imageUrl: card.getImageUrl(),
    name: card.getName(),
    card,
  }));

  const handleConfirm = (index: number) => {
    const card = cards[index];
    if (!card) return;

    if (onCardConfirm) {
      onCardConfirm(card, index);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div
        ref={containerRef}
        className={styles.container}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div className={styles.header}>
          <div className={styles.titles}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close viewer">
            ✕
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.carouselWrapper}>
            <CardCarousel
              items={items}
              activeIndex={activeIndex}
              onIndexChange={setActiveIndex}
              onConfirm={handleConfirm}
              visibleRadius={VISIBLE_RADIUS}
              cardSize={cardSize}
            />
          </div>

          <p className={styles.keyHint}>
            <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>Enter</kbd> select · <kbd>Esc</kbd> close
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardListViewer;
