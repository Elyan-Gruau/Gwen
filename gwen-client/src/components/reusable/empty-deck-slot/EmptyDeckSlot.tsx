import styles from './EmptyDeckSlot.module.scss';

type EmptyDeckSlotProps = {
  title?: string;
};

const EmptyDeckSlot = ({ title = 'Empty slot' }: EmptyDeckSlotProps) => {
  return <div className={styles.slot} title={title} />;
};

export default EmptyDeckSlot;
