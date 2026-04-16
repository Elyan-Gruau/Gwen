/**
 * API Configuration Constants
 */
import { getEnvVariableWithFallback } from 'gwen-common';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;
if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'production') {
  // eslint-disable-next-line no-console
  console.debug('[ENV] API_BASE_URL utilisé :', API_BASE_URL);
}
