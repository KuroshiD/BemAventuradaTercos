import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { LoginRequest } from '../types/auth.types';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';
const JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_secret';
const ACCESS_EXPIRES_SECONDS = parseInt(process.env.ACCESS_EXPIRES_SECONDS ?? '300', 10); // 5min default
const REFRESH_EXPIRES_SECONDS = parseInt(process.env.REFRESH_EXPIRES_SECONDS ?? String(60 * 60 * 24 * 7), 10); // 7 days

// In-memory store for refresh tokens: token -> { username, expiresAt }
const refreshStore = new Map<string, { username: string; expiresAt: number }>();

export const login = ({ username, password }: LoginRequest): { accessToken: string; refreshToken: string } => {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error('Usuário ou senha inválidos.');
  }

  const accessToken = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_SECONDS });
  const refreshToken = crypto.randomBytes(48).toString('hex');
  const expiresAt = Date.now() + REFRESH_EXPIRES_SECONDS * 1000;
  refreshStore.set(refreshToken, { username, expiresAt });

  return { accessToken, refreshToken };
};

export const logout = (refreshToken?: string): void => {
  if (refreshToken) refreshStore.delete(refreshToken);
};

export const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
};

export const refreshAccessToken = (refreshToken: string): { accessToken: string; refreshToken?: string } | null => {
  const entry = refreshStore.get(refreshToken);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    refreshStore.delete(refreshToken);
    return null;
  }

  // rotate refresh token
  refreshStore.delete(refreshToken);
  const newRefreshToken = crypto.randomBytes(48).toString('hex');
  const newExpiresAt = Date.now() + REFRESH_EXPIRES_SECONDS * 1000;
  refreshStore.set(newRefreshToken, { username: entry.username, expiresAt: newExpiresAt });

  const accessToken = jwt.sign({ sub: entry.username }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_SECONDS });
  return { accessToken, refreshToken: newRefreshToken };
};
