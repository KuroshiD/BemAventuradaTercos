import { Pool, QueryResult, QueryResultRow } from 'pg';
import env from '../env';

const pool = new Pool({
  host: env.db_host,
  port: env.db_port,
  database: env.db,
  user: env.db_user,
  password: env.db_pass,
});

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export const connect = async (): Promise<void> => {
  await pool.connect();
};

export const end = async (): Promise<void> => {
  await pool.end();
};
