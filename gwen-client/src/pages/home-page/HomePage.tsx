import { useNavigate } from 'react-router-dom';

import Button from '../../components/reusable/button/Button';
import { ROUTES } from '../../constants/routes';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.homePage}>
      <h1 className={styles.title}>Gwen</h1>
      <p className={styles.subtitle}>Welcome to Gwen!</p>
      <div className={styles.actions}>
        <Button size="lg" onClick={() => navigate(ROUTES.PLAY)}>
          Play
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.DECK_BUILDER)}>
          Deck Builder
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.PROFILE_ME)}>
          My Profile
        </Button>
      </div>
    </div>
  );
}
