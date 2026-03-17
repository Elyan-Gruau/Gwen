import { Link } from 'react-router-dom';
import SignInForm from '../../components/auth/SignInForm';
import { ROUTES } from '../../constants/routes';
import styles from './SignInPage.module.scss';

export default function SignInPage() {
  const handleSignIn = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      console.log('Sign in attempt:', values);
      // TODO: Implement API call
      // const response = await authApi.signIn(values);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <SignInForm onSubmit={handleSignIn} />
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
