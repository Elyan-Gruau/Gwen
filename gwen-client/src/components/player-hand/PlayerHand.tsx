import { useEffect, useRef, useState } from 'react';
import { type PlayableCard, type RangeType } from 'gwen-common';
import CardView, { CARD_SIZE } from '../card/CardView';
import { useGameplaySocket } from '../../hooks/useGameplaySocket';
import styles from './PlayerHand.module.scss';

export type PlayerHandSelectionSource = 'click' | 'keyboard';

export type PlayerHandProps = {
  hand: PlayableCard[];
  gameId: string;
  rowType: RangeType;
  /**
   * Called when a card is confirmed (click or Enter key).
   */
  onCardConfirm?: (card: PlayableCard, index: number, source: PlayerHandSelectionSource) => void;
  /**
   * If true, the container automatically takes focus on mount
   * to immediately enable keyboard shortcuts (arrows, Enter).
   */
  autoFocus?: boolean;
};

const PlayerHand = ({
  hand,
  gameId,
  rowType,
  onCardConfirm,
  autoFocus = false,
}: PlayerHandProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { playCard } = useGameplaySocket({ gameId });

  useEffect(() => {
    if (autoFocus && containerRef.current) {
      containerRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    if (hand.length === 0) {
      return;
    }

    if (key === 'ArrowRight') {
      setActiveIndex((prev) => {
        if (prev === null) {
          return 0;
        }
        return Math.min(prev + 1, hand.length - 1);
      });
      event.preventDefault();
      return;
    }

    if (key === 'ArrowLeft') {
      setActiveIndex((prev) => {
        if (prev === null) {
          return hand.length - 1;
        }
        return Math.max(prev - 1, 0);
      });
      event.preventDefault();
      return;
    }

    if (key === 'Enter' && activeIndex !== null && activeIndex >= 0 && activeIndex < hand.length) {
      const card = hand[activeIndex];
      if (card) {
        // Send play card request
        playCard(card.getId(), rowType);
        // Call callback if provided
        if (onCardConfirm) {
          onCardConfirm(card, activeIndex, 'keyboard');
        }
      }
      event.preventDefault();
    }
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    const card = hand[index];
    if (card) {
      // Send play card request
      playCard(card.getId(), rowType);
      // Call callback if provided
      if (onCardConfirm) {
        onCardConfirm(card, index, 'click');
      }
    }
  };

  return (
    <div ref={containerRef} className={styles.playerHand} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className={styles.cardsRow}>
        {hand.map((card, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={`${card.getName()}-${index}`}
              className={`${styles.cardSlot} ${isActive ? styles.cardSelected : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <CardView card={card} size={CARD_SIZE} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerHand;
