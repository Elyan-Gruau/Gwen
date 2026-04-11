import { Outlet } from 'react-router-dom';
import Navbar from '../../navbar/Navbar';
import styles from './NavbarLayout.module.scss';

const NavbarLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default NavbarLayout;
