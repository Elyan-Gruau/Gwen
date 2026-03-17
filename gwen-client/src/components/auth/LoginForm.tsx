import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '../../hooks/apis/AuthAPI';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import Input from '../reusable/input/Input';
import Button from '../reusable/button/Button';
import styles from './LoginForm.module.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Nom d'utilisateur requis"),
  password: Yup.string().required('Mot de passe requis'),
});

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (values: LoginFormValues) => {
    login(
      { username: values.username, password: values.password },
      {
        onSuccess: (response) => {
          setUser(response.user);
          navigate(ROUTES.HOME);
        },
      },
    );
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>Connexion</h2>

          {isError && (
            <div className={styles.error}>
              {error instanceof Error ? error.message : 'Une erreur est survenue'}
            </div>
          )}

          <Field
            name="username"
            as={Input}
            label="Nom d'utilisateur ou Email"
            type="text"
            placeholder="votre_nom_utilisateur"
            fullWidth
            error={errors.username && touched.username}
            helperText={touched.username && errors.username}
            disabled={isSubmitting || isPending}
          />

          <Field
            name="password"
            as={Input}
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            fullWidth
            error={errors.password && touched.password}
            helperText={touched.password && errors.password}
            disabled={isSubmitting || isPending}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
