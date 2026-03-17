import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { ROUTES } from '../../constants/routes';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      console.log('Login attempt:', values);
      // TODO: Implement API call
      // const response = await authApi.login(values);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <LoginForm onSubmit={handleLogin} />
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
