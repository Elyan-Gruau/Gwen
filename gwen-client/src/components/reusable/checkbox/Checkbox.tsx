import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.scss';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: Variant;
  label?: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
}

export default function Checkbox({
  variant = 'primary',
  label,
  error = false,
  helperText,
  className,
  ...props
}: CheckboxProps) {
  const classes = [
    styles.checkbox,
    styles[variant],
    error ? styles.error : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <input type="checkbox" className={classes} {...props} />
        {label && <label className={styles.label}>{label}</label>}
      </div>
      {helperText && (
        <div className={`${styles.helperText} ${error ? styles.helperTextError : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
}

