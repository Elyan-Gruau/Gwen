import { useNavigate } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useRegister } from '../../../hooks/apis/AuthAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { ROUTES } from '../../../constants/routes';
import Input from '../../reusable/input/Input';
import Button from '../../reusable/button/Button';
import styles from './SignInForm.module.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must contain at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one digit')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

interface SignInFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignInForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { mutate: register, isPending, isError, error } = useRegister();

  const handleSubmit = (values: SignInFormValues) => {
    register(
      {
        username: values.username,
        email: values.email,
        password: values.password,
      },
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
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>Create an Account</h2>

          {isError && (
            <div className={styles.error}>
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          )}

          <Field
            name="username"
            as={Input}
            label="Username"
            type="text"
            placeholder="your_username"
            fullWidth
            error={errors.username && touched.username}
            helperText={touched.username && errors.username}
            disabled={isSubmitting || isPending}
          />

          <Field
            name="email"
            as={Input}
            label="Email"
            type="email"
            placeholder="your@email.com"
            fullWidth
            error={errors.email && touched.email}
            helperText={touched.email && errors.email}
            disabled={isSubmitting || isPending}
          />

          <Field
            name="password"
            as={Input}
            label="Password"
            type="password"
            placeholder="••••••••"
            fullWidth
            error={errors.password && touched.password}
            helperText={touched.password && errors.password}
            disabled={isSubmitting || isPending}
          />

          <Field
            name="confirmPassword"
            as={Input}
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            fullWidth
            error={errors.confirmPassword && touched.confirmPassword}
            helperText={touched.confirmPassword && errors.confirmPassword}
            disabled={isSubmitting || isPending}
          />

          <Button
            type="submit"
            variant="success"
            size="lg"
            fullWidth
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? 'Signing up...' : 'Sign up'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
