import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import UserProfilePic from '../user-profile-pic/UserProfilePic';
import LinkButton from '../reusable/link-button/LinkButton';
import styles from './Navbar.module.scss';
import { useEffect, useState } from 'react';
import Button from '../reusable/button/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();

  const handleHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleProfile = () => {
    if (user?.id) {
      navigate(ROUTES.PROFILE_ME);
    }
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') return true;
    if (saved === 'light') return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('dark');

    if (darkMode) {
      document.documentElement.classList.add('dark');
    }

    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((v) => !v);
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
          <LinkButton href={ROUTES.PLAY} variant={'secondary'}>
            Matchmaking
          </LinkButton>
          <LinkButton href={ROUTES.DECK_BUILDER} variant={'secondary'}>
            Deck Builder
          </LinkButton>
          <LinkButton href={ROUTES.RULES} variant={'secondary'}>Rules</LinkButton>
        </div>

        {/* User Section */}
        <div className={styles.userSection}>
          {isAuthenticated && user ? (
            <div className={styles.rightButtons}>
              <button onClick={toggleTheme} className={styles.theme}>
                <img src={darkMode ? '/icons/dark.svg' : '/icons/light.svg'} alt="theme icon" />
              </button>

              <div className={styles.profilePic} onClick={handleProfile}>
                <UserProfilePic userId={user.id} />
              </div>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Button onClick={toggleTheme} className={styles.theme}>
                <img src={darkMode ? '/icons/dark.svg' : '/icons/light.svg'} alt="theme icon" />
              </Button>
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
