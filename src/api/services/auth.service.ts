import crypto from 'crypto';
import { LoginRequest } from '../types/auth.types';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';
const activeTokens = new Set<string>();

export const login = ({ username, password }: LoginRequest): string => {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error('Usuário ou senha inválidos.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  activeTokens.add(token);
  return token;
};

export const logout = (token: string): void => {
  activeTokens.delete(token);
};

export const verifyToken = (token: string): boolean => {
  return activeTokens.has(token);
};
