import { Request, Response } from 'express';
import { login as loginService, logout as logoutService } from '../services/auth.service';
import { LoginRequest } from '../types/auth.types';

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    res.status(400).json({ error: 'Os campos username e password são obrigatórios.' });
    return;
  }

  try {
    const token = loginService({ username, password });
    res.json({ token });
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

  logoutService(authToken);
  res.json({ message: 'Logout realizado com sucesso.' });
};
