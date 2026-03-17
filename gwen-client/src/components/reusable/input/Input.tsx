import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.scss';

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
type Size = 'sm' | 'md' | 'lg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  label?: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
}

export default function Input({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  label,
  error = false,
  helperText,
  className,
  ...props
}: InputProps) {
  const classes = [
    styles.input,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    error ? styles.error : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={classes} {...props} />
      {helperText && <div className={`${styles.helperText} ${error ? styles.helperTextError : ''}`}>{helperText}</div>}
    </div>
  );
}

