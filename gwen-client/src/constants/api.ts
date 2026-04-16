/**
 * API Configuration Constants
 */
import { getEnvVariableWithFallback } from 'gwen-common';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
const ENV_API_BASE_URL = import.meta.env.API_BASE_URL;
export const API_BASE_URL = ENV_API_BASE_URL || DEFAULT_API_BASE_URL;
if (!ENV_API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.debug('[ENV] API_BASE_URL found :', API_BASE_URL);
}
