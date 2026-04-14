import { getGemBrokenPictureUrl, getGemPictureUrl } from '../../../utils/URLProvider';
import styles from './Gem.module.scss';

export type GemProps = {
  isActive: boolean;
};

const Gem = ({ isActive }: GemProps) => {
  const path = isActive ? getGemPictureUrl() : getGemBrokenPictureUrl();
  return (
    <div className={styles.wrapper}>
      <img className={styles.image} src={path} alt="Gem" />
    </div>
  );
};

export default Gem;
