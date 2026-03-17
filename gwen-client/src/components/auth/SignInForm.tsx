import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/reusable/input/Input';
import Button from '../../components/reusable/button/Button';
import styles from './SignInForm.module.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
    .required('Nom d\'utilisateur requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
});

interface SignInFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInFormProps {
  onSubmit: (values: SignInFormValues) => void | Promise<void>;
  isLoading?: boolean;
}

export default function SignInForm({ onSubmit, isLoading = false }: SignInFormProps) {
  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>Créer un compte</h2>

          <Field
            name="username"
            as={Input}
            label="Nom d'utilisateur"
            type="text"
            placeholder="votre_nom_utilisateur"
            fullWidth
            error={errors.username && touched.username}
            helperText={touched.username && errors.username}
            disabled={isSubmitting || isLoading}
          />

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

          <Field
            name="confirmPassword"
            as={Input}
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            fullWidth
            error={errors.confirmPassword && touched.confirmPassword}
            helperText={touched.confirmPassword && errors.confirmPassword}
            disabled={isSubmitting || isLoading}
          />

          <Button
            type="submit"
            variant="success"
            size="lg"
            fullWidth
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

