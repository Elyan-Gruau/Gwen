import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/reusable/input/Input';
import Button from '../../components/reusable/button/Button';
import styles from './LoginForm.module.scss';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>Connexion</h2>

          <Field
            name="email"
            as={Input}
            label="Email"
            type="email"
            placeholder="votre@email.com"
            fullWidth
            error={errors.email && touched.email}
            helperText={touched.email && errors.email}
            disabled={isSubmitting || isLoading}
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
            disabled={isSubmitting || isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

