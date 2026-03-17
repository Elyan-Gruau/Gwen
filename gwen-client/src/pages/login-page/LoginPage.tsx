import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/login-form/LoginForm';
import { ROUTES } from '../../constants/routes';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <LoginForm />
        <p className={styles.signUpPrompt}>
          Pas encore de compte ?{' '}
          <Link to={ROUTES.SIGN_IN} className={styles.link}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
