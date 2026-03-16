import { Pool } from 'pg';

let pool: Pool | null = null;

export const getPostgresPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      user: process.env.POSTGRES_USER || 'gwenuser',
      password: process.env.POSTGRES_PASSWORD || 'gwenpassword',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      database: process.env.POSTGRES_DB || 'gwendb',
    });

    pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
};

export const closePostgresPool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
