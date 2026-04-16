/**
 * API Configuration Constants
 */
import { getEnvVariableWithFallback } from 'gwen-common';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
export const API_BASE_URL = getEnvVariableWithFallback('API_BASE_URL', DEFAULT_API_BASE_URL);
