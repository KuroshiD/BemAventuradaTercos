import { Request, Response } from 'express';
import { login as loginService, logout as logoutService, refreshAccessToken } from '../services/auth.service';
import { LoginRequest } from '../types/auth.types';

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    res.status(400).json({ error: 'Os campos username e password são obrigatórios.' });
    return;
  }

  try {
    const tokens = loginService({ username, password });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const logout = (req: Request, res: Response): void => {
  const authToken = (req as Request & { authToken?: string }).authToken;

  if (!authToken) {
    res.status(400).json({ error: 'Token de autenticação não encontrado.' });
    return;
  }

  // also try to remove refresh token if provided
  const { refreshToken } = req.body as { refreshToken?: string };
  logoutService(refreshToken);
  res.json({ message: 'Logout realizado com sucesso.' });
};

export const refresh = (req: Request, res: Response): void => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(400).json({ error: 'refreshToken is required' });
    return;
  }

  const newTokens = refreshAccessToken(refreshToken);
  if (!newTokens) {
    res.status(401).json({ error: 'Refresh token inválido ou expirado.' });
    return;
  }

  res.json(newTokens);
};
