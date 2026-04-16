import { useCallback, useEffect } from 'react';
import type { Card } from 'gwen-common';
import CardView from '../../card/CardView';
import styles from './CardCarousel.module.scss';
import type { CardSize } from '../../card/CardContainer';

export type CarouselItem = {
  id: string;
  imageUrl: string;
  name: string;
  /** Si fourni, CardView est utilisé à la place du fallback img */
  card?: Card;
};

type CardCarouselProps = {
  items: CarouselItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  /** Appelé quand l'utilisateur confirme la sélection (Entrée) */
  onConfirm?: (index: number) => void;
  /** Visible radius around the active card (center ± radius). Default: 3. */
  visibleRadius?: number;
  cardSize?: CardSize;
};

// Facteurs visuels selon la distance au centre
const SCALE_BY_DISTANCE = [1, 0.82, 0.66, 0.52];
const OPACITY_BY_DISTANCE = [1, 0.85, 0.65, 0.45];
const Z_BY_DISTANCE = [0, -60, -120, -180];
// Espacement horizontal (px) entre le centre de chaque carte
const OFFSET_STEP = 96;

const CardCarousel = ({
  items,
  activeIndex,
  onIndexChange,
  onConfirm,
  visibleRadius,
  cardSize = 'medium',
}: CardCarouselProps) => {
  const count = items.length;

  const handlePrev = useCallback(() => {
    onIndexChange((activeIndex - 1 + count) % count);
  }, [activeIndex, count, onIndexChange]);

  const handleNext = useCallback(() => {
    onIndexChange((activeIndex + 1) % count);
  }, [activeIndex, count, onIndexChange]);

  // Navigation clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Enter') onConfirm?.(activeIndex);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePrev, handleNext, onConfirm, activeIndex]);

  return (
    <div className={`${styles.scene} ${styles[`scene--${cardSize}`]}`}>
      <div className={styles.track}>
        {items.map((item, i) => {
          // distance circulaire au centre
          let dist = i - activeIndex;
          if (dist > count / 2) dist -= count;
          if (dist < -count / 2) dist += count;

          const absDist = Math.abs(dist);
          const maxVisible = Math.min(
            typeof visibleRadius === 'number' ? visibleRadius : SCALE_BY_DISTANCE.length - 1,
            SCALE_BY_DISTANCE.length - 1,
          );

          if (absDist > maxVisible) return null;

          const scale = SCALE_BY_DISTANCE[absDist];
          const opacity = OPACITY_BY_DISTANCE[absDist];
          const translateZ = Z_BY_DISTANCE[absDist];
          const translateX = dist * OFFSET_STEP;
          const isActive = dist === 0;

          return (
            <div
              key={item.id}
              className={`${styles.slot} ${styles[`slot--${cardSize}`]} ${isActive ? styles.slotActive : styles.slotInactive}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                opacity,
                zIndex: maxVisible - absDist,
              }}
              onClick={() => {
                if (!isActive) onIndexChange(i);
              }}
            >
              {item.card ? (
                <CardView card={item.card} size={cardSize} />
              ) : (
                <img src={item.imageUrl} alt={item.name} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardCarousel;
