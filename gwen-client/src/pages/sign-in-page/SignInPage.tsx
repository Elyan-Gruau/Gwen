import { Link } from 'react-router-dom';
import SignInForm from '../../components/auth/sign-in-form/SignInForm';
import { ROUTES } from '../../constants/routes';
import styles from './SignInPage.module.scss';

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <SignInForm />
        <p className={styles.loginPrompt}>
          Vous avez déjà un compte ?{' '}
          <Link to={ROUTES.LOGIN} className={styles.link}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
