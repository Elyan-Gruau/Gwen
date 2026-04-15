import styles from './CardContainer.module.scss';
import type { ReactElement } from 'react';

export type CardSize = 'x-small' | 'small' | 'medium' | 'large';
type CardContainerProps = {
  children: ReactElement;
  size?: CardSize;
};

const CardContainer = ({ children, size = 'medium' }: CardContainerProps) => {
  const className = `${styles.cardContainer} ${styles[`cardContainer--${size}`]}`;
  return <div className={className}>{children}</div>;
};

export default CardContainer;
