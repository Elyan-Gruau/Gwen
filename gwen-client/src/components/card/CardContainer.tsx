import styles from './CardContainer.module.scss';
import type { ReactElement } from 'react';

type CardContainerProps = {
  children: ReactElement;
};

const CardContainer = ({ children }: CardContainerProps) => {
  return <div className={styles.cardContainer}>{children}</div>;
};

export default CardContainer;
