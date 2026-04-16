type ServerEnvVariable =
  | 'MONGODB_URI'
  | 'PORT'
  | 'JWT_EXPIRATION'
  | 'JWT_SECRET'
  | 'CORS_ORIGIN'
  | 'NODE_ENV'
  | 'GWEN_LOGS';

type ClientEnvVariable = 'VITE_API_BASE_URL';

export type EnvVariable = ServerEnvVariable | ClientEnvVariable;

export const getEnvVariable = (name: EnvVariable): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const getEnvVariableWithFallback = (name: EnvVariable, fallback: string): string => {
  try {
    const envVariable = getEnvVariable(name);
    console.log(`[ENV] Environment variable ${name} found: ${envVariable}`);
    return envVariable;
  } catch (error) {
    console.warn(
      `[ENV] Environment variable ${name} not found, using provided fallback: ${fallback}`,
    );
    return fallback;
  }
};
