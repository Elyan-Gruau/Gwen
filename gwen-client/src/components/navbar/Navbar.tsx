import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import LinkButton from '../reusable/link-button/LinkButton';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo} onClick={handleHome}>
          <h1>⚔️ Gwen</h1>
        </div>

        {/* Nav Links */}
        <div className={styles.navLinksContainer}>
          <LinkButton href={ROUTES.PLAY}>Matchmaking</LinkButton>
          <LinkButton href={ROUTES.DECK_BUILDER}> Deck Builder</LinkButton>
        </div>

        {/* User Section */}
        <div className={styles.userSection}>TODO LATER USER SECTION</div>
      </div>
    </nav>
  );
};

export default Navbar;
