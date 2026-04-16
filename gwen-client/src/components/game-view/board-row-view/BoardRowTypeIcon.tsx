import React from 'react';
import meleeIcon from '/icons/melee.png';
import rangeIcon from '/icons/range.png';
import siegeIcon from '/icons/siege.png';
import styles from './BoardRowTypeIcon.module.scss';

export type BoardRowTypeIconSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface BoardRowTypeIconProps {
  type: string;
  size?: BoardRowTypeIconSize;
}

/**
 * Displays the icon for a board row type (MELEE, RANGED, SIEGE).
 * @param type The type of the board row.
 * @param size The size of the icon: SMALL, MEDIUM, LARGE. Default is MEDIUM.
 */
function BoardRowTypeIcon({ type, size = 'MEDIUM' }: BoardRowTypeIconProps) {
  let icon;
  switch (type) {
    case 'MELEE':
      icon = meleeIcon;
      break;
    case 'RANGED':
      icon = rangeIcon;
      break;
    case 'SIEGE':
      icon = siegeIcon;
      break;
    default:
      icon = undefined;
  }
  if (!icon) return null;
  const className = `${styles.icon} ${styles[size.toLowerCase()]}`;
  return <img src={icon} alt={type} className={className} />;
}

export default BoardRowTypeIcon;
