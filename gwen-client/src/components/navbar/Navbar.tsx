import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import UserProfilePic from '../user-profile-pic/UserProfilePic';
import Button from '../reusable/button/Button';
import LinkButton from '../reusable/link-button/LinkButton';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthContext();

  const handleHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleProfile = () => {
    if (user?.id) {
      navigate(ROUTES.PROFILE_ME);
    }
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
          <LinkButton href={ROUTES.DECK_BUILDER}>Deck Builder</LinkButton>
        </div>

        {/* User Section */}
        <div className={styles.userSection}>
          {isAuthenticated && user ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.username}>{user.username}</span>
                <span className={styles.elo}>ELO: {user.elo}</span>
              </div>
              <div className={styles.profilePic} onClick={handleProfile}>
                <UserProfilePic userId={user.id} />
              </div>
              <Button size="sm" variant="danger" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <div className={styles.authButtons}>
              <LinkButton size="sm" variant="secondary" href={ROUTES.LOGIN}>
                Login
              </LinkButton>
              <LinkButton size="sm" href={ROUTES.SIGN_IN}>
                Sign Up
              </LinkButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
