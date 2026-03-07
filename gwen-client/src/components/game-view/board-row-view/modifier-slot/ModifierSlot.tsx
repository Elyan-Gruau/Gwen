import styles from './ModifierSlot.module.scss';
import { RowModifierCard } from 'gwen-common';

export type ModifierSlotProps = {
  modifier: RowModifierCard | undefined;
};

const ModifierSlot = ({ modifier }: ModifierSlotProps) => {
  return <div className={styles.modifierSlot}>{modifier?.getName()}</div>;
};

export default ModifierSlot;
