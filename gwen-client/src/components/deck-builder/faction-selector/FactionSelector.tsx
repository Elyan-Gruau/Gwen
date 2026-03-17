import type { Faction } from 'gwen-common';
import Button from '../../reusable/button/Button';
import styles from './FactionSelector.module.scss';

type FactionSelectorProps = {
  factions: Faction[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
};

const FactionSelector = ({ factions, selectedIndex, onIndexChange }: FactionSelectorProps) => {
  const handlePrevious = () => {
    onIndexChange((selectedIndex - 1 + factions.length) % factions.length);
  };

  const handleNext = () => {
    onIndexChange((selectedIndex + 1) % factions.length);
  };

  return (
    <div className={styles.factionSelector}>
      <Button variant="ghost" size="sm" onClick={handlePrevious}>
        ← Previous
      </Button>
      <span className={styles.factionName}>{factions[selectedIndex]?.getName()}</span>
      <Button variant="ghost" size="sm" onClick={handleNext}>
        Next →
      </Button>
    </div>
  );
};

export default FactionSelector;
