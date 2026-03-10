import { useState } from 'react';
import type { LeaderCard } from 'gwen-common';
import CardCarousel from '../reusable/card-carousel/CardCarousel';
import LeaderCardView from '../card/LeaderCardView';
import Button from '../reusable/button/Button';
import styles from './FactionLeaderSelector.module.scss';

type FactionLeaderSelectorProps = {
  leaders: LeaderCard[];
  selectedLeader: LeaderCard | null;
  onLeaderSelect: (leader: LeaderCard) => void;
};

const FactionLeaderSelector = ({
  leaders,
  selectedLeader,
  onLeaderSelect,
}: FactionLeaderSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = leaders.map((l) => ({
    id: l.getId(),
    imageUrl: l.getImageUrl(),
    name: l.getName(),
    card: l,
  }));

  const handleConfirm = (index: number) => {
    onLeaderSelect(leaders[index]);
    setOpen(false);
  };

  const handleOpen = () => {
    // Pré-positionner sur le leader déjà sélectionné
    if (selectedLeader) {
      const idx = leaders.findIndex((l) => l.getId() === selectedLeader.getId());
      if (idx !== -1) setCarouselIndex(idx);
    }
    setOpen(true);
  };

  // ── Placeholder ──────────────────────────────────────────────────────────
  if (!open && !selectedLeader) {
    return (
      <div className={styles.placeholder} onClick={handleOpen}>
        <span className={styles.placeholderIcon}>👑</span>
        <span className={styles.placeholderLabel}>Choisir un leader</span>
      </div>
    );
  }

  // ── Leader sélectionné (carousel fermé) ──────────────────────────────────
  if (!open && selectedLeader) {
    return (
      <div className={styles.selector}>
        <div className={styles.selectorHeader}>
          <span className={styles.selectorTitle}>Leader</span>
          <Button variant="ghost" size="sm" onClick={handleOpen}>
            Changer
          </Button>
        </div>
        <div className={styles.selectedLeader} onClick={handleOpen}>
          <LeaderCardView card={selectedLeader} />
          <span className={styles.selectedLeaderName}>{selectedLeader.getName()}</span>
        </div>
        <div className={styles.abilityBox}>Ability — à venir</div>
      </div>
    );
  }

  // ── Carousel ouvert ───────────────────────────────────────────────────────
  return (
    <div className={styles.selector}>
      <div className={styles.selectorHeader}>
        <span className={styles.selectorTitle}>Choisir un leader</span>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          ✕
        </Button>
      </div>

      <CardCarousel
        items={carouselItems}
        activeIndex={carouselIndex}
        onIndexChange={setCarouselIndex}
        onConfirm={handleConfirm}
      />

      <p className={styles.keyHint}>
        <kbd>←</kbd> <kbd>→</kbd> naviguer · <kbd>Enter</kbd> sélectionner
      </p>

      <div className={styles.abilityBox}>Ability — à venir</div>
    </div>
  );
};

export default FactionLeaderSelector;
